import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ArchitectureSection() {
  return (
    <section id="architecture" className="mb-16 doc-content">
      <h2>Arquitetura do Sistema</h2>
      
      <Card className="mb-6" id="receiver">
        <CardHeader>
          <CardTitle>Receiver (Fechadura)</CardTitle>
        </CardHeader>
        <CardContent>
          <h4>Especificações de Hardware</h4>
          <table className="mt-4">
            <thead>
              <tr>
                <th>Componente</th>
                <th>Especificação</th>
                <th>Função</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Microcontrolador</td>
                <td>STM32L4 ou ESP32-S3</td>
                <td>Processamento principal, criptografia</td>
              </tr>
              <tr>
                <td>Secure Element</td>
                <td>ATECC608B ou NXP SE050</td>
                <td>Armazenamento seguro de chaves</td>
              </tr>
              <tr>
                <td>Módulo RF</td>
                <td>CC1101 (433MHz) ou nRF24L01+ (2.4GHz)</td>
                <td>Recepção de comandos</td>
              </tr>
              <tr>
                <td>Servomotores</td>
                <td>9x MG90S ou similar (precisão ±1°)</td>
                <td>Atuação dos pinos</td>
              </tr>
              <tr>
                <td>Bateria</td>
                <td>Li-Ion 3.7V 2000mAh</td>
                <td>Alimentação principal</td>
              </tr>
              <tr>
                <td>Sensor Tamper</td>
                <td>Switch magnético</td>
                <td>Detecção de abertura forçada</td>
              </tr>
              <tr>
                <td>RTC</td>
                <td>DS3231 ou interno</td>
                <td>Timestamp e validação temporal</td>
              </tr>
            </tbody>
          </table>

          <h4 className="mt-6">Características de Software</h4>
          <ul className="mt-2">
            <li>Secure Boot com verificação de assinatura RSA-2048</li>
            <li>Firmware criptografado com AES-256</li>
            <li>Proteção de debug (SWD/JTAG desabilitado)</li>
            <li>Watchdog timer para recuperação de falhas</li>
            <li>Logging de eventos em memória flash protegida</li>
            <li>Modo de baixo consumo entre operações</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6" id="transmitter">
        <CardHeader>
          <CardTitle>Transmitter (Controle Remoto)</CardTitle>
        </CardHeader>
        <CardContent>
          <h4>Especificações de Hardware</h4>
          <table className="mt-4">
            <thead>
              <tr>
                <th>Componente</th>
                <th>Especificação</th>
                <th>Função</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Microcontrolador</td>
                <td>ATmega328P ou STM32L0</td>
                <td>Controle e criptografia</td>
              </tr>
              <tr>
                <td>Secure Element</td>
                <td>ATECC608A</td>
                <td>Armazenamento de chave compartilhada</td>
              </tr>
              <tr>
                <td>Módulo RF</td>
                <td>CC1101 ou nRF24L01+</td>
                <td>Transmissão de comandos</td>
              </tr>
              <tr>
                <td>Bateria</td>
                <td>CR2032 (3V)</td>
                <td>Alimentação (duração ~2 anos)</td>
              </tr>
              <tr>
                <td>Botão</td>
                <td>Tact switch</td>
                <td>Acionamento</td>
              </tr>
              <tr>
                <td>LED</td>
                <td>RGB ou bicolor</td>
                <td>Indicação de status</td>
              </tr>
            </tbody>
          </table>

          <h4 className="mt-6">Características de Software</h4>
          <ul className="mt-2">
            <li>Modo sleep profundo entre acionamentos</li>
            <li>Wake-up por interrupção de botão</li>
            <li>Contador de mensagens persistente</li>
            <li>Timeout de comunicação (5 segundos)</li>
            <li>Indicação visual de bateria baixa</li>
          </ul>
        </CardContent>
      </Card>

      <Card id="infrastructure">
        <CardHeader>
          <CardTitle>Infraestrutura de Provisionamento</CardTitle>
        </CardHeader>
        <CardContent>
          <h4>Componentes</h4>
          <ul className="mt-2">
            <li>
              <strong>HSM (Hardware Security Module):</strong> Geração de pares de chaves 
              e assinatura de firmware
            </li>
            <li>
              <strong>Banco de Dados Seguro:</strong> Armazenamento criptografado de chaves 
              associadas a cada dispositivo
            </li>
            <li>
              <strong>Estação de Programação:</strong> Interface física para injeção de 
              chaves nos secure elements
            </li>
            <li>
              <strong>Sistema de Auditoria:</strong> Registro de todas as operações de 
              provisionamento
            </li>
          </ul>

          <h4 className="mt-6">Processo de Provisionamento</h4>
          <ol className="mt-2">
            <li>Geração de chave compartilhada única no HSM</li>
            <li>Injeção da chave no secure element da fechadura</li>
            <li>Injeção da mesma chave no secure element do controle</li>
            <li>Registro do par (fechadura + controle) no banco de dados</li>
            <li>Teste de comunicação e validação</li>
            <li>Selagem física dos dispositivos</li>
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}
