import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ThreatModelSection() {
  const threats = [
    {
      level: "Baixo",
      description: "Usuário curioso sem ferramentas especializadas",
      attacks: ["Tentativa de força bruta física", "Observação visual"],
      countermeasures: ["Sequência dinâmica de pinos", "Carcaça resistente"],
      color: "bg-primary/20 text-primary",
    },
    {
      level: "Médio",
      description: "Atacante com Flipper Zero ou ferramentas RF básicas",
      attacks: ["Replay de sinais RF", "Jamming simples", "Análise de frequência"],
      countermeasures: ["Challenge-Response", "FHSS", "Contador de replay", "Detecção de jamming"],
      color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    },
    {
      level: "Alto",
      description: "Atacante com SDR e conhecimento técnico avançado",
      attacks: ["RollJam", "Análise de protocolo", "Ataque de canal lateral"],
      countermeasures: ["Validação de sequência", "Criptografia forte", "Secure Element", "Proteção contra side-channel"],
      color: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
    },
    {
      level: "Crítico",
      description: "Atacante com acesso físico prolongado",
      attacks: ["Extração de firmware", "Análise invasiva", "Clonagem de hardware"],
      countermeasures: ["Secure Boot", "Proteção de debug", "Tamper detection", "Encriptação de firmware"],
      color: "bg-red-500/20 text-red-600 dark:text-red-400",
    },
  ];

  return (
    <section id="threat-model" className="mb-16 doc-content">
      <h2>Modelo de Ameaças</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Classificação de Adversários</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            O sistema foi projetado considerando diferentes níveis de ameaças, desde usuários 
            curiosos até atacantes com recursos avançados e acesso físico prolongado.
          </p>

          <div className="space-y-4">
            {threats.map((threat, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={threat.color}>
                    Nível {threat.level}
                  </Badge>
                  <span className="font-semibold">{threat.description}</span>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Ataques Possíveis:</h4>
                    <ul className="text-sm space-y-1">
                      {threat.attacks.map((attack, i) => (
                        <li key={i}>• {attack}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Contramedidas:</h4>
                    <ul className="text-sm space-y-1">
                      {threat.countermeasures.map((counter, i) => (
                        <li key={i} className="text-primary">✓ {counter}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vetores de Ataque Específicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4>Replay Attack</h4>
              <p className="text-sm text-muted-foreground">
                Captura e retransmissão de mensagens válidas. Mitigado por challenge-response 
                com nonce único e contador de mensagens.
              </p>
            </div>
            <div>
              <h4>RollJam Attack</h4>
              <p className="text-sm text-muted-foreground">
                Bloqueio de sinal legítimo enquanto captura código. Mitigado por detecção de 
                jamming e validação de sequência temporal.
              </p>
            </div>
            <div>
              <h4>Clonagem de Controle</h4>
              <p className="text-sm text-muted-foreground">
                Tentativa de duplicar controle remoto. Impossibilitado pelo secure element 
                que não permite extração de chaves.
              </p>
            </div>
            <div>
              <h4>Análise de Padrão de Pinos</h4>
              <p className="text-sm text-muted-foreground">
                Observação da sequência de movimento dos pinos. Ineficaz devido à sequência 
                dinâmica baseada em nonce que muda a cada abertura.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
