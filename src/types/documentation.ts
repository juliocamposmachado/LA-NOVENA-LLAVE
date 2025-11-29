export interface DocSection {
  id: string;
  title: string;
  icon?: string;
  subsections?: DocSubsection[];
}

export interface DocSubsection {
  id: string;
  title: string;
}

export const documentationSections: DocSection[] = [
  {
    id: "home",
    title: "Início",
    icon: "🏠",
  },
  {
    id: "objective",
    title: "Objetivo",
    icon: "🎯",
  },
  {
    id: "overview",
    title: "Visão Geral",
    icon: "📋",
  },
  {
    id: "threat-model",
    title: "Modelo de Ameaças",
    icon: "🛡️",
  },
  {
    id: "architecture",
    title: "Arquitetura do Sistema",
    icon: "🏗️",
    subsections: [
      { id: "receiver", title: "Receiver (Fechadura)" },
      { id: "transmitter", title: "Transmitter (Controle)" },
      { id: "infrastructure", title: "Infraestrutura" },
    ],
  },
  {
    id: "authentication",
    title: "Protocolo de Autenticação",
    icon: "🔐",
  },
  {
    id: "firmware",
    title: "Firmware e Atualização",
    icon: "💾",
  },
  {
    id: "anti-attack",
    title: "Medidas Anti-Ataque",
    icon: "⚔️",
  },
  {
    id: "anatel",
    title: "Requisitos ANATEL",
    icon: "📡",
  },
  {
    id: "security-checklist",
    title: "Checklist de Segurança",
    icon: "✅",
  },
  {
    id: "cost-estimation",
    title: "Estimativa de Custos",
    icon: "💰",
  },
  {
    id: "firmware-code",
    title: "Código do Firmware",
    icon: "💻",
    subsections: [
      { id: "main-structure", title: "Estrutura Principal" },
      { id: "crypto-module", title: "Módulo de Criptografia" },
      { id: "servo-control", title: "Controle de Servos" },
      { id: "rf-communication", title: "Comunicação RF" },
      { id: "security-protections", title: "Segurança e Proteções" },
    ],
  },
];
