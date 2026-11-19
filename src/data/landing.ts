import { publicAsset } from '../utils/publicAsset'

export interface OverviewSpecRow {
  label: string
  value: string
}

export interface StaggeredCircleStep {
  number: string
  title: string
  subtitle: string
  description: string
  featured?: boolean
  offsetClass: string
  iconName: 'Compass' | 'BookOpenCheck' | 'ShieldCheck' | 'Award'
}

export interface BentoFeatureCard {
  id: string
  title: string
  description: string
  ctaLabel: string
  href: string
  iconName: 'Scale' | 'FileCheck2' | 'Sparkles'
}

export interface ModuleItem {
  id: string
  code: string
  articles: string
  title: string
  description: string
  deliverables: string[]
  examTrap: string
  placeholderNote: string
}

export interface PriceStackItem {
  code: string
  label: string
  detail: string
  badge: string
  iconName: 'BookOpenCheck' | 'Scale' | 'FileCheck2' | 'Sparkles'
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export const COMPANY_INFO = {
  legalName: '68.138.039 JOAO PEDRO BARBOSA SCHNEIDER',
  cnpj: '68.138.039/0001-03',
  pixKey: '68.138.039/0001-03',
  address: 'Rua Ayrton Senna da Silva, 210 – Três Marias – Esteio/RS – CEP 93295-565',
  email: 'joaopedrobarbosaschneider06@gmail.com',
  phone: '(51) 8571-6039',
  whatsappHref:
    'https://wa.me/555185716039?text=Ol%C3%A1!%20Acabei%20de%20fazer%20o%20Pix%20de%20R%24%2029%2C90%20da%20pr%C3%A9-venda%20do%20Preparat%C3%B3rio%20para%20Conselheiros%20Tutelares.%20Segue%20o%20comprovante.',
}

export const HERO_GLASS_METRICS = [
  {
    value: 'R$ 29,90',
    label: 'Na pré-venda no Pix (de R$ 99,90)',
    iconName: 'QrCode' as const,
  },
  {
    value: '70% OFF',
    label: 'Especial Dia do Conselheiro (18/11)',
    iconName: 'Zap' as const,
  },
  {
    value: 'Lei 8.069',
    label: 'ECA + Art. 136 + Simulados CMDCA',
    iconName: 'BookOpenCheck' as const,
  },
]

export const OVERVIEW_SPECS: OverviewSpecRow[] = [
  {
    label: 'Metodologia',
    value: 'Método Construindo Pontes (MCP)',
  },
  {
    label: 'Idealizador',
    value: 'Wagner Macedo — Conselheiro Tutelar e Coordenador em Tramandaí/RS',
  },
  {
    label: 'Campanha',
    value: 'Pré-venda Dia do Conselheiro Tutelar (18 de Novembro)',
  },
  {
    label: 'Investimento',
    value: 'De R$ 99,90 por R$ 29,90 à vista no Pix (até as 23:59)',
  },
]

export const STAGGERED_STEPS: StaggeredCircleStep[] = [
  {
    number: '01',
    title: 'Mapeamento do Edital',
    subtitle: 'Foco no que cai',
    description: 'Separamos os artigos de maior incidência das bancas municipais para eliminar perda de tempo.',
    offsetClass: 'lg:mt-20',
    iconName: 'Compass',
  },
  {
    number: '02',
    title: 'Domínio do ECA',
    subtitle: 'Lei nº 8.069/90',
    description: 'Proteção integral, direitos fundamentais e medidas de proteção explicados com clareza.',
    offsetClass: 'lg:mt-0',
    iconName: 'BookOpenCheck',
  },
  {
    number: '03',
    title: 'Art. 136 na Prática',
    subtitle: 'Decisão segura',
    description: 'Entenda exatamente o que o Conselho requisita e onde termina a competência judicial.',
    featured: true,
    offsetClass: 'lg:mt-28',
    iconName: 'ShieldCheck',
  },
  {
    number: '04',
    title: 'Simulados CMDCA',
    subtitle: 'Prova objetiva e caso',
    description: 'Questões comentadas artigo por artigo e roteiro estruturado para prova discursiva.',
    offsetClass: 'lg:mt-6',
    iconName: 'Award',
  },
]

export const BENTO_CARDS: BentoFeatureCard[] = [
  {
    id: 'bento-atribuicoes',
    title: 'Atribuições e Limites do Art. 136 sem confusão',
    description:
      'Saiba responder em segundos o que o Conselheiro Tutelar aplica, o que requisita e o que encaminha ao Ministério Público.',
    ctaLabel: 'Ver módulo 02',
    href: '#conteudo',
    iconName: 'Scale',
  },
  {
    id: 'bento-simulados',
    title: 'Simulados comentados e pegadinhas de banca',
    description:
      'Treine com questões reais do processo de escolha unificado e evite os erros mais comuns nas provas municipais.',
    ctaLabel: 'Explorar grade',
    href: '#conteudo',
    iconName: 'FileCheck2',
  },
]

export const MARQUEE_ITEMS: { label: string; icon: string }[] = [
  { label: 'Art. 136 · Atribuições do Conselho', icon: 'Scale' },
  { label: 'Art. 101 · Medidas de Proteção', icon: 'BookOpen' },
  { label: 'Lei nº 8.069/90 · ECA Atualizado', icon: 'Landmark' },
  { label: 'Pegadinhas de Banca CMDCA', icon: 'Target' },
  { label: 'Estudos de Caso Discursivos', icon: 'Award' },
  { label: 'Rede de Proteção: CRAS, CREAS, MP e Juiz', icon: 'Waypoints' },
]

export const MODULES: ModuleItem[] = [
  {
    id: 'mod-1',
    code: 'Módulo 01',
    articles: 'Arts. 1º a 69 · ECA',
    title: 'Fundamentos e Direitos no ECA (Lei nº 8.069/90)',
    description:
      'Doutrina da proteção integral, prioridade absoluta e direitos fundamentais: vida, saúde, liberdade, convivência familiar e comunitária, educação e profissionalização.',
    deliverables: ['Videoaula objetiva + mapa de artigos-chave', 'Checklist de revisão rápida para a véspera'],
    examTrap:
      'Bancas costumam trocar a faixa etária legal de criança (até 12 anos incompletos) e adolescente (12 a 18 anos) ou confundir prioridade absoluta com preferência opcional de verba pública.',
    placeholderNote: '[Detalhar aulas e carga horária]',
  },
  {
    id: 'mod-2',
    code: 'Módulo 02',
    articles: 'Arts. 131 a 140 · Colegiado',
    title: 'Atribuições e Limites do Conselho Tutelar',
    description:
      'O que o conselheiro pode requisitar diretamente, quando acionar o Ministério Público ou a Justiça da Infância e Juventude, e os requisitos do processo de escolha.',
    deliverables: ['Quadro comparativo: Conselho Tutelar vs. Judiciário', 'Guia prático das requisições do Art. 136'],
    examTrap:
      'Pegadinha clássica: afirmar que o Conselho Tutelar aplica medida socioeducativa a adolescente ou destitui poder familiar. Você vai saber cravar em segundos por que isso é nulo.',
    placeholderNote: '[Detalhar aulas e carga horária]',
  },
  {
    id: 'mod-3',
    code: 'Módulo 03',
    articles: 'Arts. 98 a 128 · Rede',
    title: 'Medidas de Proteção, Socioeducativas e Rede de Garantia',
    description:
      'Diferença prática entre ato infracional de criança e de adolescente, aplicação do Art. 101 e conexão com CRAS, CREAS, saúde e escola.',
    deliverables: ['Fluxograma de encaminhamento na rede', 'Casos comentados de violação de direitos'],
    examTrap:
      'Erro comum em discursivas: encaminhar criança autora de ato infracional para internação ou semiliberdade (Art. 112) em vez das medidas específicas de proteção do Art. 101.',
    placeholderNote: '[Detalhar aulas e carga horária]',
  },
  {
    id: 'mod-4',
    code: 'Módulo 04',
    articles: 'Simulados · Bancas CMDCA',
    title: 'Simulados Comentados e Estudos de Caso',
    description:
      'Resolução guiada de questões frequentes em editais do CMDCA e análise de casos práticos para provas objetivas e discursivas.',
    deliverables: ['Caderno de questões comentadas', 'Modelo de resposta estruturada para prova discursiva'],
    examTrap:
      'Respostas discursivas perdem ponto quando o candidato dá opinião pessoal sem citar a base legal do Art. 136 e o fluxo correto de notificação ao MP.',
    placeholderNote: '[Detalhar aulas e carga horária]',
  },
]

export const WAGNER_PROFILE = {
  name: 'Wagner Macedo',
  role: 'Idealizador e Fundador do Método Construindo Pontes (MCP)',
  summary:
    'Atuação prática na ponta da rede de proteção unida à formação em gestão, liderança e comunicação para transformar estudo em segurança no dia da prova e no atendimento.',
  image: publicAsset('/assets/wagner-macedo.jpg'),
  credentials: [
    'Conselheiro Tutelar e Coordenador do Conselho Tutelar de Tramandaí/RS',
    'Coordenador da regional Litoral da ACONTURS',
    'Palestrante e especialista no ECA (Lei 8.069/90), resoluções do CONANDA e atribuições do Conselho Tutelar',
    'Graduado em Marketing Digital e Pós-graduado (MBA) em Gestão e Liderança Inovadora',
  ],
}

export const AUDIENCE_FOR: string[] = [
  'Candidatos ao Processo de Escolha Unificado do Conselho Tutelar.',
  'Suplentes que querem dominar as atribuições do Art. 136 antes da convocação.',
  'Conselheiros em exercício buscando reciclagem prática e segura no ECA.',
  'Quem trabalha o dia inteiro e precisa de roteiro objetivo para estudar com constância.',
]

export const PRICE_STACK_ITEMS: PriceStackItem[] = [
  {
    code: '01',
    label: 'Trilha completa do ECA atualizado (Lei nº 8.069/90)',
    detail: 'Todos os capítulos e artigos campeões explicados sem juridiquês',
    badge: 'Incluso hoje',
    iconName: 'BookOpenCheck',
  },
  {
    code: '02',
    label: 'Guia definitivo do Art. 136 e Medidas do Art. 101',
    detail: 'Saiba diferenciar o papel do Conselho, MP, Juiz e rede',
    badge: 'Incluso hoje',
    iconName: 'Scale',
  },
  {
    code: '03',
    label: 'Simulados comentados estilo CMDCA + Estudos de Caso',
    detail: 'Treino prático para provas objetivas e discursivas',
    badge: 'Incluso hoje',
    iconName: 'FileCheck2',
  },
  {
    code: '04',
    label: '[Bônus ou material complementar da pré-venda]',
    detail: '[Carga horária e data de liberação em placeholder]',
    badge: 'Bônus 18/11',
    iconName: 'Sparkles',
  },
]

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Como funciona a pré-venda e quando recebo o acesso?',
    answer:
      'Garantindo sua vaga hoje por R$ 29,90 no Pix, você trava o menor preço da turma. O acesso completo será liberado em [Data de liberação] na plataforma [Plataforma / Área de membros], com instruções enviadas no seu e-mail.',
  },
  {
    id: 'faq-2',
    question: 'Por que o valor caiu de R$ 99,90 para R$ 29,90?',
    answer:
      'É a condição comemorativa do Dia do Conselheiro Tutelar (18 de Novembro), válida exclusivamente para inscrições à vista via Pix até as 23:59 de hoje.',
  },
  {
    id: 'faq-3',
    question: 'O preparatório serve para a prova da minha cidade?',
    answer:
      'Sim. O conteúdo principal de todos os editais do Conselho Tutelar no Brasil é o Estatuto da Criança e do Adolescente (Lei Federal nº 8.069/90) e as atribuições do colegiado.',
  },
  {
    id: 'faq-4',
    question: 'E se eu tiver alguma dúvida ou precisar de garantia?',
    answer:
      'Você conta com [Ex: 7 dias de garantia após a liberação completa] e atendimento direto pelo e-mail joaopedrobarbosaschneider06@gmail.com ou WhatsApp (51) 8571-6039.',
  },
]
