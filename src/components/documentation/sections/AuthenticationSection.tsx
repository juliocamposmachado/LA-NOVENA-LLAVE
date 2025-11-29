import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";

export function AuthenticationSection() {
  const protocolCode = `// Estrutura de mensagem do protocolo
typedef struct {
  uint8_t msg_type;        // Tipo de mensagem
  uint32_t device_id;      // ID do dispositivo
  uint32_t counter;        // Contador de replay
  uint8_t nonce[16];       // Nonce aleatório (128 bits)
  uint8_t mac[32];         // HMAC-SHA256
  uint8_t payload[64];     // Dados adicionais
} Message;

// Tipos de mensagem
#define MSG_UNLOCK_REQUEST  0x01
#define MSG_CHALLENGE       0x02
#define MSG_RESPONSE        0x03
#define MSG_ACK             0x04
#define MSG_NACK            0x05`;

  const challengeResponseCode = `// Geração de challenge na fechadura
void generate_challenge(uint8_t *nonce, uint32_t *counter) {
  // Gera nonce aleatório usando TRNG
  if (!ateccx08a_random(nonce)) {
    // Fallback para gerador pseudo-aleatório
    for (int i = 0; i < 16; i++) {
      nonce[i] = rand() & 0xFF;
    }
  }
  
  // Incrementa contador de mensagens
  (*counter)++;
  save_counter_to_flash(*counter);
}

// Cálculo de response no controle remoto
bool calculate_response(const uint8_t *nonce, uint32_t counter, 
                       uint8_t *mac_out) {
  uint8_t data[20];
  
  // Concatena nonce + counter
  memcpy(data, nonce, 16);
  memcpy(data + 16, &counter, 4);
  
  // Calcula HMAC usando chave no secure element
  atca_hmac_params_t params = {
    .mode = HMAC_MODE_FLAG_FULLSN,
    .key_id = 0,  // Slot da chave compartilhada
  };
  
  return atcab_hmac(data, 20, &params, mac_out) == ATCA_SUCCESS;
}

// Validação de response na fechadura
bool validate_response(const uint8_t *nonce, uint32_t counter,
                      const uint8_t *received_mac) {
  uint8_t expected_mac[32];
  uint8_t data[20];
  
  // Reconstrói dados
  memcpy(data, nonce, 16);
  memcpy(data + 16, &counter, 4);
  
  // Calcula HMAC esperado
  atca_hmac_params_t params = {
    .mode = HMAC_MODE_FLAG_FULLSN,
    .key_id = 0,
  };
  
  if (atcab_hmac(data, 20, &params, expected_mac) != ATCA_SUCCESS) {
    return false;
  }
  
  // Compara MACs em tempo constante
  return constant_time_compare(expected_mac, received_mac, 32);
}`;

  const flowDiagram = `Fluxo de Autenticação Challenge-Response:

┌─────────────┐                           ┌──────────────┐
│  Controle   │                           │  Fechadura   │
│   Remoto    │                           │              │
└──────┬──────┘                           └──────┬───────┘
       │                                         │
       │  1. UNLOCK_REQUEST                     │
       │  (device_id, counter)                  │
       ├────────────────────────────────────────>│
       │                                         │
       │                                         │ 2. Valida device_id
       │                                         │    Gera nonce
       │                                         │
       │  3. CHALLENGE                           │
       │  (nonce, counter)                       │
       │<────────────────────────────────────────┤
       │                                         │
       │ 4. Calcula HMAC                         │
       │    MAC = HMAC(key, nonce||counter)      │
       │                                         │
       │  5. RESPONSE                            │
       │  (counter, MAC)                         │
       ├────────────────────────────────────────>│
       │                                         │
       │                                         │ 6. Valida MAC
       │                                         │    Verifica counter
       │                                         │    Calcula sequência
       │                                         │    Aciona servos
       │  7. ACK                                 │
       │<────────────────────────────────────────┤
       │                                         │
       │  8. LED verde                           │ 9. Pinos se movem
       │                                         │`;

  return (
    <section id="authentication" className="mb-16 doc-content">
      <h2>Protocolo de Autenticação</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Challenge-Response com HMAC-SHA256</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            O protocolo utiliza um mecanismo de desafio-resposta baseado em HMAC-SHA256, 
            garantindo que apenas dispositivos com a chave compartilhada correta possam 
            autenticar-se com sucesso.
          </p>

          <h4>Características do Protocolo</h4>
          <ul className="mb-4">
            <li>Nonce único de 128 bits gerado por TRNG (True Random Number Generator)</li>
            <li>Contador de mensagens para proteção contra replay</li>
            <li>HMAC-SHA256 calculado no secure element</li>
            <li>Timeout de 5 segundos para cada etapa</li>
            <li>Máximo de 3 tentativas antes de lockout temporário</li>
          </ul>

          <CodeBlock
            code={protocolCode}
            language="c"
            filename="protocol.h"
            showLineNumbers={true}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fluxo de Mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={flowDiagram}
            language="text"
            showLineNumbers={false}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementação do Challenge-Response</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={challengeResponseCode}
            language="c"
            filename="authentication.c"
            showLineNumbers={true}
          />

          <div className="mt-6 bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Notas de Segurança</h4>
            <ul className="text-sm space-y-1">
              <li>• A chave compartilhada nunca sai do secure element</li>
              <li>• O HMAC é calculado internamente no chip criptográfico</li>
              <li>• Comparação de MAC em tempo constante previne timing attacks</li>
              <li>• Contador é persistido em flash para sobreviver a resets</li>
              <li>• Nonce deve ser verdadeiramente aleatório (não pseudo-aleatório)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
