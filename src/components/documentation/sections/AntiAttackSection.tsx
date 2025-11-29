import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";

export function AntiAttackSection() {
  const jammingDetectionCode = `// Detecção de Jamming RF
#define RSSI_THRESHOLD        -90  // dBm
#define NOISE_FLOOR_NORMAL    -100 // dBm
#define JAMMING_DURATION_MS   1000

typedef struct {
  int8_t rssi_samples[10];
  uint8_t sample_index;
  uint32_t high_rssi_start;
  bool jamming_detected;
} JammingDetector;

JammingDetector jammer_detector = {0};

void check_for_jamming(void) {
  int8_t current_rssi = rf_get_rssi();
  
  // Armazena amostra
  jammer_detector.rssi_samples[jammer_detector.sample_index] = current_rssi;
  jammer_detector.sample_index = (jammer_detector.sample_index + 1) % 10;
  
  // Calcula média de RSSI
  int16_t rssi_sum = 0;
  for (int i = 0; i < 10; i++) {
    rssi_sum += jammer_detector.rssi_samples[i];
  }
  int8_t avg_rssi = rssi_sum / 10;
  
  // RSSI alto sem mensagem válida = possível jamming
  if (avg_rssi > RSSI_THRESHOLD && !rf_has_valid_packet()) {
    if (jammer_detector.high_rssi_start == 0) {
      jammer_detector.high_rssi_start = millis();
    }
    
    // Jamming persistente por mais de 1 segundo
    if (millis() - jammer_detector.high_rssi_start > JAMMING_DURATION_MS) {
      jammer_detector.jamming_detected = true;
      handle_jamming_attack();
    }
  } else {
    jammer_detector.high_rssi_start = 0;
  }
}

void handle_jamming_attack(void) {
  // Log do evento
  log_security_event(EVENT_JAMMING_DETECTED);
  
  // Muda para canal alternativo
  rf_hop_to_next_channel();
  
  // Aumenta potência de transmissão (se permitido pela ANATEL)
  rf_increase_tx_power();
  
  // Notifica usuário (LED vermelho piscando)
  set_led_pattern(LED_PATTERN_JAMMING_ALERT);
}`;

  const antiRollJamCode = `// Proteção contra RollJam
#define MAX_COUNTER_WINDOW  5  // Aceita até 5 mensagens futuras

typedef struct {
  uint32_t last_valid_counter;
  uint32_t pending_counters[MAX_COUNTER_WINDOW];
  uint8_t pending_count;
} CounterValidator;

CounterValidator counter_state = {0};

bool validate_counter(uint32_t received_counter) {
  // Rejeita contadores antigos (replay)
  if (received_counter <= counter_state.last_valid_counter) {
    log_security_event(EVENT_REPLAY_ATTEMPT);
    return false;
  }
  
  // Aceita contadores dentro da janela
  if (received_counter <= counter_state.last_valid_counter + MAX_COUNTER_WINDOW) {
    // Verifica se já foi usado
    for (int i = 0; i < counter_state.pending_count; i++) {
      if (counter_state.pending_counters[i] == received_counter) {
        return false;  // Contador duplicado
      }
    }
    
    // Adiciona à lista de pendentes
    counter_state.pending_counters[counter_state.pending_count++] = received_counter;
    
    // Atualiza último contador válido
    if (received_counter > counter_state.last_valid_counter) {
      counter_state.last_valid_counter = received_counter;
      save_counter_to_flash(received_counter);
      
      // Limpa contadores antigos da lista
      cleanup_pending_counters();
    }
    
    return true;
  }
  
  // Contador muito à frente - possível ataque
  log_security_event(EVENT_SUSPICIOUS_COUNTER);
  return false;
}`;

  const tamperDetectionCode = `// Detecção de Tamper (Abertura Forçada)
#define TAMPER_PIN  GPIO_PIN_13
#define TAMPER_LOCKOUT_TIME  300000  // 5 minutos

typedef struct {
  bool tamper_active;
  uint32_t tamper_start_time;
  uint32_t tamper_count;
} TamperState;

TamperState tamper_state = {0};

void init_tamper_detection(void) {
  // Configura pino de tamper com pull-up
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  GPIO_InitStruct.Pin = TAMPER_PIN;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
  
  // Habilita interrupção
  HAL_NVIC_SetPriority(EXTI15_10_IRQn, 0, 0);
  HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);
}

void EXTI15_10_IRQHandler(void) {
  if (__HAL_GPIO_EXTI_GET_IT(TAMPER_PIN) != RESET) {
    __HAL_GPIO_EXTI_CLEAR_IT(TAMPER_PIN);
    handle_tamper_event();
  }
}

void handle_tamper_event(void) {
  tamper_state.tamper_active = true;
  tamper_state.tamper_start_time = millis();
  tamper_state.tamper_count++;
  
  // Log do evento com timestamp
  log_security_event(EVENT_TAMPER_DETECTED);
  
  // Alarme sonoro
  activate_buzzer(BUZZER_PATTERN_ALARM);
  
  // LED vermelho
  set_led_color(LED_RED);
  
  // Bloqueia operação por 5 minutos
  enter_lockout_mode(TAMPER_LOCKOUT_TIME);
  
  // Tenta enviar alerta (se houver conectividade)
  send_tamper_alert();
}

bool is_tamper_lockout_active(void) {
  if (tamper_state.tamper_active) {
    if (millis() - tamper_state.tamper_start_time < TAMPER_LOCKOUT_TIME) {
      return true;
    } else {
      tamper_state.tamper_active = false;
    }
  }
  return false;
}`;

  return (
    <section id="anti-attack" className="mb-16 doc-content">
      <h2>Medidas Anti-Ataque</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Proteção contra Flipper Zero</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            O Flipper Zero é uma ferramenta popular para ataques de replay e análise de RF. 
            O sistema implementa múltiplas camadas de proteção contra este tipo de dispositivo.
          </p>

          <h4>Contramedidas Implementadas</h4>
          <ul className="mb-4">
            <li>
              <strong>Challenge-Response:</strong> Cada transação requer um nonce único, 
              impossibilitando replay de mensagens capturadas
            </li>
            <li>
              <strong>FHSS (Frequency Hopping):</strong> Comunicação em múltiplas frequências 
              dificulta captura completa
            </li>
            <li>
              <strong>Contador de Mensagens:</strong> Previne reutilização de mensagens antigas
            </li>
            <li>
              <strong>Timeout Curto:</strong> Janela de 5 segundos para completar autenticação
            </li>
            <li>
              <strong>Detecção de Jamming:</strong> Identifica tentativas de bloqueio de sinal
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detecção de Jamming RF</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            O sistema monitora continuamente o espectro RF para detectar tentativas de jamming 
            (bloqueio intencional do sinal).
          </p>

          <CodeBlock
            code={jammingDetectionCode}
            language="c"
            filename="jamming_detection.c"
            showLineNumbers={true}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Proteção contra RollJam</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            RollJam é um ataque que captura códigos válidos enquanto bloqueia sua recepção, 
            permitindo uso posterior. O sistema usa validação de contador com janela limitada.
          </p>

          <CodeBlock
            code={antiRollJamCode}
            language="c"
            filename="anti_rolljam.c"
            showLineNumbers={true}
          />

          <div className="mt-4 bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Como Funciona</h4>
            <p className="text-sm">
              O sistema aceita contadores dentro de uma janela de 5 mensagens futuras, 
              mas rastreia quais já foram usados. Isso permite operação normal mesmo com 
              perda ocasional de pacotes, mas impede que um atacante use códigos capturados 
              anteriormente.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detecção de Tamper (Abertura Forçada)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Sensor de tamper detecta tentativas de abertura física da fechadura e ativa 
            contramedidas automáticas.
          </p>

          <CodeBlock
            code={tamperDetectionCode}
            language="c"
            filename="tamper_detection.c"
            showLineNumbers={true}
          />

          <h4 className="mt-6">Resposta a Tamper</h4>
          <ul className="mt-2">
            <li>Alarme sonoro imediato</li>
            <li>LED vermelho de alerta</li>
            <li>Bloqueio de operação por 5 minutos</li>
            <li>Registro do evento com timestamp</li>
            <li>Tentativa de envio de alerta remoto</li>
            <li>Incremento de contador de tentativas</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
