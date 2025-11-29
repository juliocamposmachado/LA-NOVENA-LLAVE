import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OverviewSection() {
  return (
    <section id="overview" className="mb-16 doc-content">
      <h2>Visão Geral do Sistema</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Arquitetura de Três Entidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3>1. Fechadura (Receiver)</h3>
            <p>
              Dispositivo instalado na porta, contendo o mecanismo de 9 pinos servo-atuados, 
              receptor RF, secure element e microcontrolador principal.
            </p>
            <ul className="mt-2">
              <li>Microcontrolador: STM32 ou ESP32 com suporte a criptografia</li>
              <li>Secure Element: ATECC608A/B ou SE050</li>
              <li>Receptor RF: Módulo 433MHz ou 2.4GHz com FHSS</li>
              <li>9 Servomotores de alta precisão</li>
              <li>Bateria recarregável com backup</li>
            </ul>
          </div>

          <div>
            <h3>2. Controle Remoto (Transmitter)</h3>
            <p>
              Dispositivo portátil que o usuário carrega, responsável por iniciar o processo 
              de autenticação e enviar comandos criptografados.
            </p>
            <ul className="mt-2">
              <li>Microcontrolador de baixo consumo</li>
              <li>Secure Element para armazenamento de chaves</li>
              <li>Transmissor RF com FHSS</li>
              <li>Botão de acionamento</li>
              <li>LED de status</li>
              <li>Bateria tipo moeda (CR2032)</li>
            </ul>
          </div>

          <div>
            <h3>3. Ambiente de Provisionamento</h3>
            <p>
              Sistema seguro utilizado durante a fabricação para gerar e injetar chaves 
              criptográficas nos dispositivos.
            </p>
            <ul className="mt-2">
              <li>HSM (Hardware Security Module) para geração de chaves</li>
              <li>Software de provisionamento com auditoria</li>
              <li>Banco de dados criptografado de chaves</li>
              <li>Interface de programação segura</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Operação Básico</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li>
              <strong>Acionamento:</strong> Usuário pressiona botão no controle remoto
            </li>
            <li>
              <strong>Requisição:</strong> Controle envia mensagem de requisição de abertura
            </li>
            <li>
              <strong>Challenge:</strong> Fechadura gera nonce aleatório e envia ao controle
            </li>
            <li>
              <strong>Response:</strong> Controle calcula HMAC usando chave compartilhada e nonce
            </li>
            <li>
              <strong>Validação:</strong> Fechadura verifica HMAC e valida contador de replay
            </li>
            <li>
              <strong>Execução:</strong> Se válido, fechadura calcula sequência de pinos baseada no nonce
            </li>
            <li>
              <strong>Abertura:</strong> Servos movem os 9 pinos na sequência calculada
            </li>
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}
