import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CostEstimationSection() {
  return (
    <section id="cost-estimation" className="mb-16 doc-content">
      <h2>Estimativa de Custos</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Custo de Componentes por Unidade</CardTitle>
        </CardHeader>
        <CardContent>
          <table>
            <thead>
              <tr>
                <th>Componente</th>
                <th>Especificação</th>
                <th>China</th>
                <th>Alemanha</th>
                <th>Brasil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Microcontrolador</td>
                <td>STM32L4 / ESP32-S3</td>
                <td>$3.50</td>
                <td>$5.20</td>
                <td>R$ 35</td>
              </tr>
              <tr>
                <td>Secure Element</td>
                <td>ATECC608B</td>
                <td>$0.80</td>
                <td>$1.20</td>
                <td>R$ 12</td>
              </tr>
              <tr>
                <td>Módulo RF</td>
                <td>CC1101 / nRF24L01+</td>
                <td>$1.20</td>
                <td>$2.50</td>
                <td>R$ 18</td>
              </tr>
              <tr>
                <td>Servomotores (9x)</td>
                <td>MG90S</td>
                <td>$13.50</td>
                <td>$22.50</td>
                <td>R$ 135</td>
              </tr>
              <tr>
                <td>Bateria Li-Ion</td>
                <td>3.7V 2000mAh</td>
                <td>$2.50</td>
                <td>$4.00</td>
                <td>R$ 25</td>
              </tr>
              <tr>
                <td>PCB</td>
                <td>4 camadas</td>
                <td>$3.00</td>
                <td>$8.00</td>
                <td>R$ 45</td>
              </tr>
              <tr>
                <td>Carcaça</td>
                <td>Plástico ABS</td>
                <td>$4.50</td>
                <td>$12.00</td>
                <td>R$ 60</td>
              </tr>
              <tr>
                <td>Outros componentes</td>
                <td>Passivos, conectores</td>
                <td>$2.00</td>
                <td>$4.00</td>
                <td>R$ 25</td>
              </tr>
              <tr className="font-bold bg-muted">
                <td colSpan={2}>Total Fechadura</td>
                <td>$31.00</td>
                <td>$59.40</td>
                <td>R$ 355</td>
              </tr>
            </tbody>
          </table>

          <h4 className="mt-6">Controle Remoto</h4>
          <table className="mt-4">
            <thead>
              <tr>
                <th>Componente</th>
                <th>China</th>
                <th>Alemanha</th>
                <th>Brasil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Microcontrolador + RF</td>
                <td>$2.00</td>
                <td>$3.50</td>
                <td>R$ 22</td>
              </tr>
              <tr>
                <td>Secure Element</td>
                <td>$0.80</td>
                <td>$1.20</td>
                <td>R$ 12</td>
              </tr>
              <tr>
                <td>PCB + Carcaça</td>
                <td>$1.50</td>
                <td>$4.00</td>
                <td>R$ 25</td>
              </tr>
              <tr>
                <td>Bateria CR2032</td>
                <td>$0.30</td>
                <td>$0.80</td>
                <td>R$ 5</td>
              </tr>
              <tr className="font-bold bg-muted">
                <td>Total Controle</td>
                <td>$4.60</td>
                <td>$9.50</td>
                <td>R$ 64</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Custos de Desenvolvimento e Certificação</CardTitle>
        </CardHeader>
        <CardContent>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Custo Estimado</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Desenvolvimento de Firmware</td>
                <td>$15.000 - $25.000</td>
                <td>3-4 meses, 1-2 engenheiros</td>
              </tr>
              <tr>
                <td>Design de Hardware</td>
                <td>$8.000 - $12.000</td>
                <td>PCB, esquemático, BOM</td>
              </tr>
              <tr>
                <td>Protótipos (10 unidades)</td>
                <td>$2.000 - $3.000</td>
                <td>Montagem e testes</td>
              </tr>
              <tr>
                <td>Homologação ANATEL</td>
                <td>R$ 13.400 - R$ 25.800</td>
                <td>Taxas + ensaios laboratoriais</td>
              </tr>
              <tr>
                <td>Certificação FCC (EUA)</td>
                <td>$5.000 - $10.000</td>
                <td>Opcional para exportação</td>
              </tr>
              <tr>
                <td>Certificação CE (Europa)</td>
                <td>€4.000 - €8.000</td>
                <td>Opcional para exportação</td>
              </tr>
              <tr>
                <td>Ferramental de Injeção</td>
                <td>$8.000 - $15.000</td>
                <td>Moldes para carcaça</td>
              </tr>
              <tr className="font-bold bg-muted">
                <td>Total Desenvolvimento</td>
                <td>$51.000 - $98.800</td>
                <td>Investimento inicial</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise de Produção em Escala</CardTitle>
        </CardHeader>
        <CardContent>
          <h4>Custo por Unidade (Fechadura + Controle)</h4>
          <table className="mt-4">
            <thead>
              <tr>
                <th>Volume</th>
                <th>China</th>
                <th>Alemanha</th>
                <th>Brasil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>100 unidades</td>
                <td>$42.00</td>
                <td>$82.00</td>
                <td>R$ 500</td>
              </tr>
              <tr>
                <td>1.000 unidades</td>
                <td>$36.00</td>
                <td>$69.00</td>
                <td>R$ 420</td>
              </tr>
              <tr>
                <td>10.000 unidades</td>
                <td>$31.00</td>
                <td>$58.00</td>
                <td>R$ 360</td>
              </tr>
              <tr className="font-bold bg-primary/10">
                <td>100.000 unidades</td>
                <td>$27.00</td>
                <td>$52.00</td>
                <td>R$ 320</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Recomendações</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Prototipagem:</strong> China (custo-benefício ideal)</li>
              <li>• <strong>Produção inicial (1k-10k):</strong> China ou Brasil (considerar logística)</li>
              <li>• <strong>Produção em escala (&gt;10k):</strong> China (melhor custo)</li>
              <li>• <strong>Mercado premium europeu:</strong> Alemanha (qualidade percebida)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
