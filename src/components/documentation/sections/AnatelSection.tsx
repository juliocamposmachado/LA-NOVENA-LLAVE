import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnatelSection() {
  return (
    <section id="anatel" className="mb-16 doc-content">
      <h2>Requisitos ANATEL</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Homologação de Dispositivos RF no Brasil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Para comercialização no Brasil, o sistema deve ser homologado pela ANATEL 
            (Agência Nacional de Telecomunicações) conforme regulamentação vigente.
          </p>

          <h4>Normas Aplicáveis</h4>
          <ul className="mb-4">
            <li><strong>Resolução nº 680/2017:</strong> Regulamento sobre equipamentos de radiocomunicação de radiação restrita</li>
            <li><strong>Ato nº 14448/2017:</strong> Requisitos técnicos para equipamentos de radiação restrita</li>
            <li><strong>Resolução nº 506/2008:</strong> Regulamento sobre equipamentos de telecomunicações</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Especificações Técnicas RF</CardTitle>
        </CardHeader>
        <CardContent>
          <h4>Opção 1: Banda 433 MHz (ISM)</h4>
          <table className="mt-4 mb-6">
            <thead>
              <tr>
                <th>Parâmetro</th>
                <th>Valor</th>
                <th>Limite ANATEL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Frequência</td>
                <td>433.050 - 434.790 MHz</td>
                <td>Conforme</td>
              </tr>
              <tr>
                <td>Potência EIRP</td>
                <td>10 mW (10 dBm)</td>
                <td>Máx. 10 mW</td>
              </tr>
              <tr>
                <td>Largura de Banda</td>
                <td>25 kHz</td>
                <td>Conforme</td>
              </tr>
              <tr>
                <td>Duty Cycle</td>
                <td>&lt; 10%</td>
                <td>Máx. 10%</td>
              </tr>
            </tbody>
          </table>

          <h4>Opção 2: Banda 2.4 GHz (ISM)</h4>
          <table className="mt-4">
            <thead>
              <tr>
                <th>Parâmetro</th>
                <th>Valor</th>
                <th>Limite ANATEL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Frequência</td>
                <td>2400 - 2483.5 MHz</td>
                <td>Conforme</td>
              </tr>
              <tr>
                <td>Potência EIRP</td>
                <td>100 mW (20 dBm)</td>
                <td>Máx. 100 mW</td>
              </tr>
              <tr>
                <td>FHSS</td>
                <td>Mín. 15 canais</td>
                <td>Conforme</td>
              </tr>
              <tr>
                <td>Dwell Time</td>
                <td>&lt; 400 ms</td>
                <td>Máx. 400 ms</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Documentação Necessária</CardTitle>
        </CardHeader>
        <CardContent>
          <h4>Documentos para Homologação</h4>
          <ul className="mb-4">
            <li>Requerimento de certificação (formulário ANATEL)</li>
            <li>Manual do usuário em português</li>
            <li>Esquemático eletrônico completo</li>
            <li>Lista de materiais (BOM)</li>
            <li>Fotos internas e externas do produto</li>
            <li>Etiqueta de identificação com número de homologação</li>
            <li>Declaração de conformidade do fabricante</li>
            <li>Relatórios de ensaios de laboratório acreditado</li>
          </ul>

          <h4>Ensaios Obrigatórios</h4>
          <ul>
            <li>Medição de potência de transmissão</li>
            <li>Medição de frequência e estabilidade</li>
            <li>Medição de largura de banda ocupada</li>
            <li>Medição de emissões espúrias</li>
            <li>Medição de imunidade a interferências</li>
            <li>Compatibilidade eletromagnética (EMC)</li>
            <li>Segurança elétrica</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processo de Homologação</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li>
              <strong>Pré-análise:</strong> Verificação da documentação técnica (2-4 semanas)
            </li>
            <li>
              <strong>Ensaios:</strong> Testes em laboratório acreditado pela ANATEL (4-8 semanas)
            </li>
            <li>
              <strong>Análise ANATEL:</strong> Avaliação dos resultados e documentação (4-12 semanas)
            </li>
            <li>
              <strong>Certificação:</strong> Emissão do certificado de homologação
            </li>
            <li>
              <strong>Registro:</strong> Inclusão no sistema Mosaico da ANATEL
            </li>
          </ol>

          <div className="mt-6 bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Custos Estimados</h4>
            <ul className="text-sm space-y-1">
              <li>• Taxa ANATEL: R$ 400 - R$ 800</li>
              <li>• Ensaios laboratoriais: R$ 8.000 - R$ 15.000</li>
              <li>• Consultoria (opcional): R$ 5.000 - R$ 10.000</li>
              <li>• <strong>Total estimado: R$ 13.400 - R$ 25.800</strong></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
