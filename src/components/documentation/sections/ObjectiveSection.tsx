import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ObjectiveSection() {
  return (
    <section id="objective" className="mb-16 doc-content">
      <h2>Objetivo</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Objetivo do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Desenvolver um sistema de fechadura eletrônica de alta segurança que combine:
          </p>
          
          <ul>
            <li>
              <strong>Segurança Criptográfica:</strong> Utilização de algoritmos modernos (AES-256, HMAC-SHA256) 
              com secure elements dedicados para proteção de chaves
            </li>
            <li>
              <strong>Mecanismo Físico Inovador:</strong> Sistema de 9 pinos servo-atuados com sequência dinâmica 
              baseada em nonce criptográfico, impossibilitando ataques de observação
            </li>
            <li>
              <strong>Comunicação Segura:</strong> Protocolo RF com FHSS (Frequency Hopping Spread Spectrum) 
              para resistência a jamming e interceptação
            </li>
            <li>
              <strong>Proteção Contra Ataques Modernos:</strong> Contramedidas específicas contra Flipper Zero, 
              SDR (Software Defined Radio), RollJam e outros vetores de ataque conhecidos
            </li>
            <li>
              <strong>Conformidade Regulatória:</strong> Atendimento completo aos requisitos da ANATEL para 
              dispositivos de RF no Brasil
            </li>
            <li>
              <strong>Atualizabilidade Segura:</strong> Sistema de Secure Boot e atualização OTA (Over-The-Air) 
              com verificação criptográfica de integridade
            </li>
          </ul>

          <div className="bg-muted p-4 rounded-lg mt-6">
            <h4 className="font-semibold mb-2">Público-Alvo</h4>
            <p className="text-sm">
              Esta documentação é destinada a equipes de engenharia, desenvolvedores de firmware, 
              investidores técnicos e parceiros que necessitam compreender a arquitetura completa 
              e as decisões de design do sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
