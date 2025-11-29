import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";

export function FirmwareCodeSection() {
  const mainStructureCode = `// main.c - Estrutura Principal do Firmware
#include "stm32l4xx_hal.h"
#include "crypto.h"
#include "servo_control.h"
#include "rf_protocol.h"
#include "security.h"
#include "config.h"

// Estados da fechadura
typedef enum {
  STATE_IDLE,
  STATE_WAITING_CHALLENGE,
  STATE_VALIDATING_RESPONSE,
  STATE_UNLOCKING,
  STATE_LOCKED,
  STATE_TAMPER_ALERT,
  STATE_LOCKOUT
} LockState;

// Estrutura de contexto global
typedef struct {
  LockState current_state;
  uint32_t last_unlock_time;
  uint32_t failed_attempts;
  bool tamper_detected;
  uint8_t current_nonce[16];
  uint32_t message_counter;
} LockContext;

LockContext lock_ctx = {
  .current_state = STATE_IDLE,
  .failed_attempts = 0,
  .tamper_detected = false,
  .message_counter = 0
};

// Inicialização do sistema
void system_init(void) {
  // Inicializa HAL
  HAL_Init();
  SystemClock_Config();
  
  // Inicializa periféricos
  GPIO_Init();
  UART_Init();
  SPI_Init();
  I2C_Init();
  
  // Inicializa módulos de segurança
  secure_element_init();
  crypto_init();
  
  // Inicializa RF
  rf_init();
  rf_set_receive_mode();
  
  // Inicializa servos
  servo_init();
  servo_lock_all();
  
  // Inicializa detecção de tamper
  tamper_init();
  
  // Carrega contador de mensagens da flash
  load_message_counter(&lock_ctx.message_counter);
  
  // LED de status
  set_led_color(LED_GREEN);
}

// Loop principal
int main(void) {
  system_init();
  
  log_event(EVENT_SYSTEM_BOOT);
  
  while (1) {
    // Verifica tamper
    if (check_tamper()) {
      handle_tamper_event();
      continue;
    }
    
    // Verifica lockout
    if (is_lockout_active()) {
      HAL_Delay(1000);
      continue;
    }
    
    // Máquina de estados
    switch (lock_ctx.current_state) {
      case STATE_IDLE:
        handle_idle_state();
        break;
        
      case STATE_WAITING_CHALLENGE:
        handle_challenge_state();
        break;
        
      case STATE_VALIDATING_RESPONSE:
        handle_validation_state();
        break;
        
      case STATE_UNLOCKING:
        handle_unlock_state();
        break;
        
      case STATE_LOCKOUT:
        handle_lockout_state();
        break;
        
      default:
        lock_ctx.current_state = STATE_IDLE;
        break;
    }
    
    // Watchdog
    HAL_IWDG_Refresh(&hiwdg);
    
    // Modo de baixo consumo
    if (lock_ctx.current_state == STATE_IDLE) {
      enter_low_power_mode();
    }
  }
}`;

  const cryptoModuleCode = `// crypto.c - Módulo de Criptografia
#include "crypto.h"
#include "atca_basic.h"
#include "mbedtls/sha256.h"
#include "mbedtls/aes.h"

#define SHARED_KEY_SLOT  0
#define NONCE_SIZE       16
#define MAC_SIZE         32

// Inicializa secure element
bool crypto_init(void) {
  ATCAIfaceCfg cfg = {
    .iface_type = ATCA_I2C_IFACE,
    .devtype = ATECC608B,
    .atcai2c.slave_address = 0xC0,
    .atcai2c.bus = 1,
    .atcai2c.baud = 400000,
  };
  
  if (atcab_init(&cfg) != ATCA_SUCCESS) {
    return false;
  }
  
  // Verifica se está configurado
  bool is_locked = false;
  atcab_is_locked(LOCK_ZONE_CONFIG, &is_locked);
  
  if (!is_locked) {
    // Dispositivo não provisionado
    return false;
  }
  
  return true;
}

// Gera nonce aleatório
bool generate_nonce(uint8_t *nonce) {
  // Usa TRNG do secure element
  ATCA_STATUS status = atcab_random(nonce);
  
  if (status != ATCA_SUCCESS) {
    // Fallback: usa RNG do microcontrolador
    RNG_HandleTypeDef hrng;
    hrng.Instance = RNG;
    HAL_RNG_Init(&hrng);
    
    for (int i = 0; i < NONCE_SIZE; i += 4) {
      uint32_t random;
      HAL_RNG_GenerateRandomNumber(&hrng, &random);
      memcpy(nonce + i, &random, 4);
    }
    
    HAL_RNG_DeInit(&hrng);
  }
  
  return true;
}

// Calcula HMAC-SHA256
bool calculate_hmac(const uint8_t *data, size_t data_len, 
                   uint8_t *mac_out) {
  atca_hmac_in_out_t hmac_params;
  
  hmac_params.mode = HMAC_MODE_FLAG_FULLSN;
  hmac_params.key_id = SHARED_KEY_SLOT;
  hmac_params.sn = NULL;
  
  ATCA_STATUS status = atcab_hmac(
    data,
    data_len,
    SHARED_KEY_SLOT,
    mac_out,
    HMAC_MODE_FLAG_FULLSN
  );
  
  return (status == ATCA_SUCCESS);
}

// Valida HMAC em tempo constante
bool validate_hmac(const uint8_t *expected, const uint8_t *received) {
  volatile uint8_t result = 0;
  
  // Comparação em tempo constante
  for (int i = 0; i < MAC_SIZE; i++) {
    result |= expected[i] ^ received[i];
  }
  
  return (result == 0);
}

// Deriva sequência de pinos do nonce
void derive_pin_sequence(const uint8_t *nonce, uint8_t *sequence) {
  uint8_t hash[32];
  
  // SHA-256 do nonce
  mbedtls_sha256_context ctx;
  mbedtls_sha256_init(&ctx);
  mbedtls_sha256_starts(&ctx, 0);
  mbedtls_sha256_update(&ctx, nonce, NONCE_SIZE);
  mbedtls_sha256_finish(&ctx, hash);
  mbedtls_sha256_free(&ctx);
  
  // Usa primeiros 9 bytes do hash para sequência
  for (int i = 0; i < 9; i++) {
    sequence[i] = hash[i] % 9;  // Posição 0-8
  }
  
  // Garante que não há repetições
  for (int i = 0; i < 9; i++) {
    for (int j = i + 1; j < 9; j++) {
      if (sequence[i] == sequence[j]) {
        sequence[j] = (sequence[j] + 1) % 9;
      }
    }
  }
}`;

  const servoControlCode = `// servo_control.c - Controle de Servos
#include "servo_control.h"
#include "stm32l4xx_hal.h"

#define NUM_SERVOS       9
#define SERVO_MIN_PULSE  500   // 0.5ms
#define SERVO_MAX_PULSE  2500  // 2.5ms
#define SERVO_PERIOD     20000 // 20ms

TIM_HandleTypeDef htim2;

// Posições dos servos (0 = travado, 180 = destravado)
typedef struct {
  uint8_t pin_id;
  uint16_t current_angle;
  uint16_t target_angle;
  GPIO_TypeDef *gpio_port;
  uint16_t gpio_pin;
} ServoState;

ServoState servos[NUM_SERVOS] = {
  {0, 0, 0, GPIOA, GPIO_PIN_0},
  {1, 0, 0, GPIOA, GPIO_PIN_1},
  {2, 0, 0, GPIOA, GPIO_PIN_2},
  {3, 0, 0, GPIOA, GPIO_PIN_3},
  {4, 0, 0, GPIOB, GPIO_PIN_0},
  {5, 0, 0, GPIOB, GPIO_PIN_1},
  {6, 0, 0, GPIOB, GPIO_PIN_2},
  {7, 0, 0, GPIOC, GPIO_PIN_0},
  {8, 0, 0, GPIOC, GPIO_PIN_1},
};

// Inicializa PWM para servos
void servo_init(void) {
  // Configura Timer 2 para PWM
  __HAL_RCC_TIM2_CLK_ENABLE();
  
  htim2.Instance = TIM2;
  htim2.Init.Prescaler = 80 - 1;  // 1MHz
  htim2.Init.Period = SERVO_PERIOD - 1;
  htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
  htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
  
  HAL_TIM_PWM_Init(&htim2);
  
  // Configura pinos GPIO
  for (int i = 0; i < NUM_SERVOS; i++) {
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = servos[i].gpio_pin;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM2;
    HAL_GPIO_Init(servos[i].gpio_port, &GPIO_InitStruct);
  }
  
  HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_ALL);
}

// Define ângulo do servo (0-180 graus)
void servo_set_angle(uint8_t servo_id, uint16_t angle) {
  if (servo_id >= NUM_SERVOS || angle > 180) {
    return;
  }
  
  // Converte ângulo para largura de pulso
  uint16_t pulse_width = SERVO_MIN_PULSE + 
    ((angle * (SERVO_MAX_PULSE - SERVO_MIN_PULSE)) / 180);
  
  // Atualiza PWM
  __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1 + servo_id, pulse_width);
  
  servos[servo_id].current_angle = angle;
}

// Trava todos os pinos
void servo_lock_all(void) {
  for (int i = 0; i < NUM_SERVOS; i++) {
    servo_set_angle(i, 0);
    HAL_Delay(50);
  }
}

// Destrava pinos na sequência baseada em nonce
void servo_unlock_sequence(const uint8_t *sequence) {
  // Sequência dinâmica baseada no nonce
  for (int i = 0; i < NUM_SERVOS; i++) {
    uint8_t pin_id = sequence[i];
    
    // Move pino para posição destravada
    servo_set_angle(pin_id, 180);
    
    // Delay entre movimentos
    HAL_Delay(100);
  }
  
  // Mantém destravado por 5 segundos
  HAL_Delay(5000);
  
  // Retrava na ordem reversa
  for (int i = NUM_SERVOS - 1; i >= 0; i--) {
    uint8_t pin_id = sequence[i];
    servo_set_angle(pin_id, 0);
    HAL_Delay(100);
  }
}`;

  const rfCommunicationCode = `// rf_protocol.c - Comunicação RF com FHSS
#include "rf_protocol.h"
#include "cc1101.h"

#define NUM_CHANNELS     50
#define CHANNEL_SPACING  200  // kHz
#define BASE_FREQ        433050  // kHz
#define DWELL_TIME       50   // ms por canal

// Tabela de canais para FHSS
const uint16_t channel_table[NUM_CHANNELS] = {
  433050, 433250, 433450, 433650, 433850,
  434050, 434250, 434450, 434650, 434850,
  // ... mais 40 canais
};

typedef struct {
  uint8_t current_channel;
  uint32_t last_hop_time;
  bool jamming_detected;
  int8_t rssi_samples[10];
  uint8_t rssi_index;
} FHSS_State;

FHSS_State fhss = {0};

// Inicializa módulo RF
bool rf_init(void) {
  // Inicializa SPI
  cc1101_init();
  
  // Configura CC1101
  cc1101_write_reg(CC1101_FREQ2, 0x10);  // 433MHz
  cc1101_write_reg(CC1101_FREQ1, 0xA7);
  cc1101_write_reg(CC1101_FREQ0, 0x62);
  
  cc1101_write_reg(CC1101_MDMCFG4, 0x5B);  // Bandwidth
  cc1101_write_reg(CC1101_MDMCFG3, 0xF8);  // Data rate
  cc1101_write_reg(CC1101_MDMCFG2, 0x03);  // Modulation
  
  cc1101_write_reg(CC1101_PKTCTRL0, 0x05); // Packet mode
  cc1101_write_reg(CC1101_PKTLEN, 0xFF);   // Max packet
  
  // Potência de transmissão (10mW para ANATEL)
  cc1101_write_reg(CC1101_PATABLE, 0x60);
  
  return true;
}

// Salta para próximo canal (FHSS)
void rf_hop_to_next_channel(void) {
  fhss.current_channel = (fhss.current_channel + 1) % NUM_CHANNELS;
  
  uint32_t freq = channel_table[fhss.current_channel];
  
  // Calcula registradores de frequência
  uint32_t freq_reg = (freq * 65536) / 26000;
  
  cc1101_write_reg(CC1101_FREQ2, (freq_reg >> 16) & 0xFF);
  cc1101_write_reg(CC1101_FREQ1, (freq_reg >> 8) & 0xFF);
  cc1101_write_reg(CC1101_FREQ0, freq_reg & 0xFF);
  
  fhss.last_hop_time = HAL_GetTick();
}

// Envia mensagem
bool rf_send_message(const Message *msg) {
  // Serializa mensagem
  uint8_t buffer[sizeof(Message)];
  memcpy(buffer, msg, sizeof(Message));
  
  // Envia em múltiplos canais (diversidade)
  for (int i = 0; i < 3; i++) {
    cc1101_send_packet(buffer, sizeof(Message));
    HAL_Delay(10);
    rf_hop_to_next_channel();
  }
  
  return true;
}

// Recebe mensagem
bool rf_receive_message(Message *msg, uint32_t timeout_ms) {
  uint32_t start_time = HAL_GetTick();
  
  while (HAL_GetTick() - start_time < timeout_ms) {
    // Verifica jamming
    check_for_jamming();
    
    if (fhss.jamming_detected) {
      rf_hop_to_next_channel();
      continue;
    }
    
    // Verifica se há pacote
    if (cc1101_packet_available()) {
      uint8_t buffer[sizeof(Message)];
      uint8_t len = cc1101_receive_packet(buffer, sizeof(Message));
      
      if (len == sizeof(Message)) {
        memcpy(msg, buffer, sizeof(Message));
        return true;
      }
    }
    
    // Hop periódico
    if (HAL_GetTick() - fhss.last_hop_time > DWELL_TIME) {
      rf_hop_to_next_channel();
    }
    
    HAL_Delay(1);
  }
  
  return false;
}`;

  const securityProtectionsCode = `// security.c - Segurança e Proteções
#include "security.h"
#include "flash.h"

#define MAX_FAILED_ATTEMPTS  3
#define LOCKOUT_DURATION_MS  300000  // 5 minutos
#define TAMPER_PIN           GPIO_PIN_13

typedef struct {
  uint32_t failed_attempts;
  uint32_t lockout_start_time;
  bool lockout_active;
  uint32_t tamper_count;
  uint32_t last_event_time;
} SecurityState;

SecurityState security = {0};

// Inicializa proteções de segurança
void security_init(void) {
  // Desabilita debug (SWD/JTAG)
  __HAL_AFIO_REMAP_SWJ_DISABLE();
  
  // Ativa Read Protection Level 2
  FLASH_OBProgramInitTypeDef ob_config;
  HAL_FLASHEx_OBGetConfig(&ob_config);
  
  if (ob_config.RDPLevel != OB_RDP_LEVEL_2) {
    ob_config.RDPLevel = OB_RDP_LEVEL_2;
    HAL_FLASH_Unlock();
    HAL_FLASH_OB_Unlock();
    HAL_FLASHEx_OBProgram(&ob_config);
    HAL_FLASH_OB_Launch();
    HAL_FLASH_OB_Lock();
    HAL_FLASH_Lock();
  }
  
  // Inicializa watchdog
  IWDG_HandleTypeDef hiwdg;
  hiwdg.Instance = IWDG;
  hiwdg.Init.Prescaler = IWDG_PRESCALER_64;
  hiwdg.Init.Reload = 4095;
  HAL_IWDG_Init(&hiwdg);
  
  // Carrega estado da flash
  load_security_state(&security);
}

// Registra tentativa falhada
void register_failed_attempt(void) {
  security.failed_attempts++;
  save_security_state(&security);
  
  log_security_event(EVENT_AUTH_FAILED);
  
  if (security.failed_attempts >= MAX_FAILED_ATTEMPTS) {
    enter_lockout_mode();
  }
}

// Entra em modo de lockout
void enter_lockout_mode(void) {
  security.lockout_active = true;
  security.lockout_start_time = HAL_GetTick();
  
  log_security_event(EVENT_LOCKOUT_ACTIVATED);
  
  // LED vermelho piscando
  set_led_pattern(LED_PATTERN_LOCKOUT);
  
  // Alarme sonoro
  activate_buzzer(BUZZER_PATTERN_LOCKOUT);
}

// Verifica se lockout está ativo
bool is_lockout_active(void) {
  if (security.lockout_active) {
    uint32_t elapsed = HAL_GetTick() - security.lockout_start_time;
    
    if (elapsed >= LOCKOUT_DURATION_MS) {
      security.lockout_active = false;
      security.failed_attempts = 0;
      save_security_state(&security);
      log_security_event(EVENT_LOCKOUT_CLEARED);
      return false;
    }
    return true;
  }
  return false;
}

// Limpa tentativas falhadas após sucesso
void clear_failed_attempts(void) {
  security.failed_attempts = 0;
  save_security_state(&security);
}

// Log de eventos de segurança
void log_security_event(SecurityEvent event) {
  EventLog log_entry = {
    .event_type = event,
    .timestamp = RTC_GetTimestamp(),
    .counter = security.tamper_count,
  };
  
  // Salva em flash protegida
  flash_write_log(&log_entry);
}`;

  return (
    <section id="firmware-code" className="mb-16 doc-content">
      <h2>Código do Firmware</h2>
      
      <p className="mb-6">
        Esta seção apresenta exemplos práticos de implementação do firmware em C/C++, 
        com comentários detalhados e explicações técnicas.
      </p>

      <Card className="mb-6" id="main-structure">
        <CardHeader>
          <CardTitle>Estrutura Principal do Firmware</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            O arquivo main.c contém a inicialização do sistema e o loop principal 
            com máquina de estados para gerenciar as operações da fechadura.
          </p>
          <CodeBlock
            code={mainStructureCode}
            language="c"
            filename="main.c"
            showLineNumbers={true}
            collapsible={true}
          />
        </CardContent>
      </Card>

      <Card className="mb-6" id="crypto-module">
        <CardHeader>
          <CardTitle>Módulo de Criptografia</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Implementação das funções criptográficas utilizando o secure element ATECC608B 
            e a biblioteca mbedTLS.
          </p>
          <CodeBlock
            code={cryptoModuleCode}
            language="c"
            filename="crypto.c"
            showLineNumbers={true}
            collapsible={true}
          />
          <div className="mt-4 bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Bibliotecas Necessárias</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>cryptoauthlib:</strong> Interface com ATECC608B</li>
              <li>• <strong>mbedTLS:</strong> Implementações criptográficas</li>
              <li>• <strong>STM32 HAL:</strong> Acesso a periféricos</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6" id="servo-control">
        <CardHeader>
          <CardTitle>Controle de Servos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Algoritmo de controle dos 9 servomotores com sequência dinâmica baseada 
            no nonce criptográfico.
          </p>
          <CodeBlock
            code={servoControlCode}
            language="c"
            filename="servo_control.c"
            showLineNumbers={true}
            collapsible={true}
          />
        </CardContent>
      </Card>

      <Card className="mb-6" id="rf-communication">
        <CardHeader>
          <CardTitle>Comunicação RF com FHSS</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Implementação do protocolo de comunicação RF com Frequency Hopping Spread Spectrum 
            para resistência a jamming.
          </p>
          <CodeBlock
            code={rfCommunicationCode}
            language="c"
            filename="rf_protocol.c"
            showLineNumbers={true}
            collapsible={true}
          />
        </CardContent>
      </Card>

      <Card id="security-protections">
        <CardHeader>
          <CardTitle>Segurança e Proteções</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Sistema de proteção contra ataques, incluindo lockout após tentativas falhadas 
            e detecção de tamper.
          </p>
          <CodeBlock
            code={securityProtectionsCode}
            language="c"
            filename="security.c"
            showLineNumbers={true}
            collapsible={true}
          />
          
          <div className="mt-6 bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Arquivos Adicionais</h4>
            <p className="text-sm mb-2">
              O firmware completo inclui também os seguintes módulos:
            </p>
            <ul className="text-sm space-y-1">
              <li>• <code>config.h</code> - Configurações e constantes do sistema</li>
              <li>• <code>flash.c/h</code> - Gerenciamento de memória flash</li>
              <li>• <code>rtc.c/h</code> - Real-Time Clock para timestamps</li>
              <li>• <code>led.c/h</code> - Controle de LEDs de status</li>
              <li>• <code>buzzer.c/h</code> - Controle de alarme sonoro</li>
              <li>• <code>power.c/h</code> - Gerenciamento de energia</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
