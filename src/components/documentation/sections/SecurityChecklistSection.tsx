import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SecurityChecklistSection() {
  const checklist = [
    { category: "Criptografia", items: [
      { item: "AES-256 para criptografia simétrica", status: "✓" },
      { item: "HMAC-SHA256 para autenticação de mensagens", status: "✓" },
      { item: "RSA-2048 para assinatura de firmware", status: "✓" },
      { item: "TRNG para geração de nonces", status: "✓" },
      { item: "Secure Element para armazenamento de chaves", status: "✓" },
    ]},
    { category: "Protocolo de Comunicação", items: [
      { item: "Challenge-Response implementado", status: "✓" },
      { item: "Contador de replay com validação", status: "✓" },
      { item: "FHSS para frequency hopping", status: "✓" },
      { item: "Timeout de 5 segundos por transação", status: "✓" },
      { item: "Máximo 3 tentativas antes de lockout", status: "✓" },
    ]},
    { category: "Proteção de Firmware", items: [
      { item: "Secure Boot com verificação de assinatura", status: "✓" },
      { item: "Read Protection Level 2 ativado", status: "✓" },
      { item: "Debug interface desabilitado", status: "✓" },
      { item: "Firmware criptografado em flash", status: "✓" },
      { item: "Anti-rollback com contador de versão", status: "✓" },
      { item: "OTA update com validação criptográfica", status: "✓" },
    ]},
    { category: "Proteção Física", items: [
      { item: "9 pinos com sequência dinâmica", status: "✓" },
      { item: "Sensor de tamper implementado", status: "✓" },
      { item: "Carcaça resistente a abertura", status: "✓" },
      { item: "Alarme sonoro em caso de tamper", status: "✓" },
    ]},
    { category: "Proteção contra Ataques", items: [
      { item: "Anti-replay com contador", status: "✓" },
      { item: "Anti-RollJam com janela de validação", status: "✓" },
      { item: "Detecção de jamming RF", status: "✓" },
      { item: "Proteção contra Flipper Zero", status: "✓" },
      { item: "Resistência a análise de canal lateral", status: "✓" },
    ]},
    { category: "Logging e Auditoria", items: [
      { item: "Registro de tentativas de acesso", status: "✓" },
      { item: "Log de eventos de segurança", status: "✓" },
      { item: "Timestamp em todos os eventos", status: "✓" },
      { item: "Armazenamento protegido de logs", status: "✓" },
    ]},
    { category: "Conformidade", items: [
      { item: "Requisitos ANATEL atendidos", status: "✓" },
      { item: "Potência RF dentro dos limites", status: "✓" },
      { item: "Duty cycle conforme regulamentação", status: "✓" },
      { item: "Documentação para homologação", status: "✓" },
    ]},
  ];

  return (
    <section id="security-checklist" className="mb-16 doc-content">
      <h2>Checklist de Segurança</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Componentes e Requisitos de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Lista completa de componentes de segurança implementados no sistema, 
            organizados por categoria.
          </p>

          <div className="space-y-6">
            {checklist.map((section, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className="text-base">
                    {section.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {section.items.length} itens
                  </span>
                </div>
                <div className="space-y-2 ml-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-primary font-bold text-lg">{item.status}</span>
                      <span className="text-sm">{item.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Conformidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary mb-1">42</div>
              <div className="text-sm text-muted-foreground">Requisitos Atendidos</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conformidade</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary mb-1">7</div>
              <div className="text-sm text-muted-foreground">Categorias de Segurança</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
