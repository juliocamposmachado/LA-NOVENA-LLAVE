import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";

export function FirmwareSection() {
  const secureBootCode = `// Secure Boot - Verificação de assinatura do firmware
#define FIRMWARE_START_ADDR  0x08010000
#define SIGNATURE_ADDR       0x0807F000
#define PUBLIC_KEY_ADDR      0x0807F800

typedef struct {
  uint32_t firmware_size;
  uint32_t version;
  uint8_t signature[256];  // RSA-2048 signature
  uint8_t hash[32];        // SHA-256 do firmware
} FirmwareHeader;

bool verify_firmware_signature(void) {
  FirmwareHeader *header = (FirmwareHeader *)SIGNATURE_ADDR;
  uint8_t *firmware = (uint8_t *)FIRMWARE_START_ADDR;
  uint8_t calculated_hash[32];
  
  // Calcula SHA-256 do firmware
  mbedtls_sha256_context ctx;
  mbedtls_sha256_init(&ctx);
  mbedtls_sha256_starts(&ctx, 0);
  mbedtls_sha256_update(&ctx, firmware, header->firmware_size);
  mbedtls_sha256_finish(&ctx, calculated_hash);
  mbedtls_sha256_free(&ctx);
  
  // Verifica hash
  if (memcmp(calculated_hash, header->hash, 32) != 0) {
    return false;
  }
  
  // Verifica assinatura RSA
  mbedtls_rsa_context rsa;
  mbedtls_rsa_init(&rsa, MBEDTLS_RSA_PKCS_V21, MBEDTLS_MD_SHA256);
  
  // Carrega chave pública
  load_public_key(&rsa, PUBLIC_KEY_ADDR);
  
  // Verifica assinatura
  int ret = mbedtls_rsa_pkcs1_verify(
    &rsa,
    MBEDTLS_MD_SHA256,
    32,
    calculated_hash,
    header->signature
  );
  
  mbedtls_rsa_free(&rsa);
  return (ret == 0);
}

void secure_boot(void) {
  // Desabilita debug
  disable_debug_interface();
  
  // Verifica assinatura do firmware
  if (!verify_firmware_signature()) {
    // Firmware inválido - entra em modo de recuperação
    enter_recovery_mode();
    while(1);  // Não executa firmware não assinado
  }
  
  // Firmware válido - continua boot
  jump_to_application(FIRMWARE_START_ADDR);
}`;

  const otaUpdateCode = `// Atualização OTA (Over-The-Air)
typedef struct {
  uint32_t total_size;
  uint32_t chunk_size;
  uint32_t current_chunk;
  uint32_t total_chunks;
  uint8_t chunk_data[256];
  uint8_t chunk_mac[32];
} OTA_Packet;

#define OTA_BUFFER_ADDR  0x08080000  // Área temporária

bool process_ota_packet(OTA_Packet *packet) {
  static uint32_t bytes_received = 0;
  static uint8_t expected_chunk = 0;
  
  // Valida sequência de chunks
  if (packet->current_chunk != expected_chunk) {
    return false;
  }
  
  // Valida MAC do chunk
  if (!validate_chunk_mac(packet)) {
    return false;
  }
  
  // Escreve chunk na flash
  uint32_t write_addr = OTA_BUFFER_ADDR + bytes_received;
  flash_write(write_addr, packet->chunk_data, packet->chunk_size);
  
  bytes_received += packet->chunk_size;
  expected_chunk++;
  
  // Último chunk?
  if (packet->current_chunk == packet->total_chunks - 1) {
    return finalize_ota_update(bytes_received);
  }
  
  return true;
}

bool finalize_ota_update(uint32_t total_size) {
  // Verifica assinatura do novo firmware
  FirmwareHeader *new_header = (FirmwareHeader *)(OTA_BUFFER_ADDR + total_size);
  
  if (!verify_new_firmware_signature(new_header, OTA_BUFFER_ADDR)) {
    // Assinatura inválida - descarta atualização
    flash_erase(OTA_BUFFER_ADDR, total_size);
    return false;
  }
  
  // Copia novo firmware para área principal
  flash_copy(OTA_BUFFER_ADDR, FIRMWARE_START_ADDR, total_size);
  
  // Atualiza header de assinatura
  flash_write(SIGNATURE_ADDR, new_header, sizeof(FirmwareHeader));
  
  // Reinicia para aplicar atualização
  NVIC_SystemReset();
  
  return true;
}`;

  return (
    <section id="firmware" className="mb-16 doc-content">
      <h2>Firmware e Atualização Segura</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Secure Boot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            O sistema implementa Secure Boot para garantir que apenas firmware assinado 
            digitalmente possa ser executado no dispositivo.
          </p>

          <h4>Processo de Secure Boot</h4>
          <ol className="mb-4">
            <li>Bootloader verifica assinatura RSA-2048 do firmware</li>
            <li>Calcula SHA-256 do firmware e compara com hash assinado</li>
            <li>Se válido, desabilita interface de debug e executa firmware</li>
            <li>Se inválido, entra em modo de recuperação e não executa</li>
          </ol>

          <CodeBlock
            code={secureBootCode}
            language="c"
            filename="secure_boot.c"
            showLineNumbers={true}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Atualização OTA (Over-The-Air)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            O firmware pode ser atualizado remotamente através de comunicação RF segura, 
            mantendo a integridade e autenticidade do novo firmware.
          </p>

          <h4>Características da Atualização OTA</h4>
          <ul className="mb-4">
            <li>Transmissão em chunks de 256 bytes</li>
            <li>Cada chunk possui MAC para validação de integridade</li>
            <li>Validação de sequência para prevenir perda de pacotes</li>
            <li>Verificação de assinatura antes de aplicar atualização</li>
            <li>Rollback automático em caso de falha</li>
            <li>Área de staging separada da área de execução</li>
          </ul>

          <CodeBlock
            code={otaUpdateCode}
            language="c"
            filename="ota_update.c"
            showLineNumbers={true}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proteções Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4>Read Protection Level (RDP)</h4>
              <p className="text-sm text-muted-foreground">
                Configurado para nível 2 (máximo) no STM32, impedindo leitura da flash 
                mesmo com acesso físico ao chip.
              </p>
            </div>
            <div>
              <h4>Debug Interface Disabled</h4>
              <p className="text-sm text-muted-foreground">
                SWD/JTAG desabilitado permanentemente após provisionamento, impedindo 
                debug e extração de firmware.
              </p>
            </div>
            <div>
              <h4>Firmware Encryption</h4>
              <p className="text-sm text-muted-foreground">
                Firmware armazenado criptografado com AES-256, chave derivada de UID 
                único do microcontrolador.
              </p>
            </div>
            <div>
              <h4>Anti-Rollback</h4>
              <p className="text-sm text-muted-foreground">
                Contador de versão monotônico impede instalação de versões antigas com 
                vulnerabilidades conhecidas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
