import { Download, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function HomeSection() {
  const handleDownloadPDF = () => {
    alert("Funcionalidade de download de PDF será implementada em breve");
  };

  const handleDownloadSource = () => {
    alert("Funcionalidade de download do código-fonte será implementada em breve");
  };

  return (
    <section id="home" className="mb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl xl:text-5xl font-bold mb-4 text-primary">
          Sistema de Fechadura Inteligente
        </h1>
        <p className="text-xl xl:text-2xl text-muted-foreground mb-2">
          Documentação Técnica de Firmware
        </p>
        <p className="text-lg text-muted-foreground">
          Fechadura Eletrônica Criptográfica com 9 Pinos Servo-Atuados
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Resumo Executivo</h2>
          <p className="text-lg leading-relaxed mb-4">
            Este documento apresenta a especificação técnica completa do firmware para um sistema de fechadura eletrônica de alta segurança, 
            baseado em criptografia moderna e arquitetura de três entidades: <strong>Fechadura</strong>, <strong>Controle Remoto</strong> e 
            <strong>Ambiente de Provisionamento</strong>.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            O sistema utiliza um mecanismo inovador de 9 pinos servo-atuados com sequência dinâmica baseada em desafio criptográfico, 
            garantindo proteção contra ataques de replay, clonagem e análise de padrões.
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">256-bit</div>
              <div className="text-sm text-muted-foreground">Criptografia AES</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">9 Pinos</div>
              <div className="text-sm text-muted-foreground">Servo-Atuados</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">FHSS</div>
              <div className="text-sm text-muted-foreground">Frequency Hopping</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col xl:flex-row gap-4 justify-center">
        <Button size="lg" onClick={handleDownloadPDF} className="gap-2">
          <FileText className="h-5 w-5" />
          Baixar Documentação PDF
        </Button>
        <Button size="lg" variant="outline" onClick={handleDownloadSource} className="gap-2">
          <Code className="h-5 w-5" />
          Baixar Código-Fonte (.zip)
        </Button>
      </div>
    </section>
  );
}
