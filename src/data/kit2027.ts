import { publicAsset } from '../utils/publicAsset'

export interface VisualSheetSample {
  id: string
  moduleLabel: string
  pageLabel: string
  title: string
  subtitle: string
  accentColor: 'blue' | 'cyan' | 'cobalt'
  points: { title: string; text: string }[]
  legalBase: string[]
  examTip: string
}

export interface KitModuleItem {
  number: string
  title: string
  description: string
  image: string
  iconName:
    | 'BookOpen'
    | 'HeartHandshake'
    | 'Scale'
    | 'ShieldCheck'
    | 'Users'
    | 'Waypoints'
    | 'Lightbulb'
    | 'FileCheck2'
}

export interface RealPagePreview {
  id: string
  category: 'mod1-4' | 'mod5-8' | 'bonus'
  moduleLabel: string
  pageLabel: string
  title: string
  image: string
}

export interface KitBonusItem {
  code: string
  title: string
  description: string
  image: string
  iconName: 'CalendarDays' | 'Map' | 'CheckSquare'
}

export interface KitTier {
  id: 'basico' | 'premium'
  name: string
  badge?: string
  price: number
  priceFormatted: string
  features: string[]
  ctaLabel: string
}

export interface KitFaqItem {
  id: string
  question: string
  answer: string
}

export const KIT_HERO_HIGHLIGHTS = [
  {
    text: '8 módulos organizados por assunto',
    iconName: 'Layers' as const,
  },
  {
    text: '50 páginas de conteúdos visuais',
    iconName: 'FileText' as const,
  },
  {
    text: 'Material em PDF para estudar pelo celular ou imprimir',
    iconName: 'Smartphone' as const,
  },
]

export const VISUAL_SAMPLES: VisualSheetSample[] = [
  {
    id: 'sheet-1',
    moduleLabel: 'Módulo 01 · Fundamentos do ECA',
    pageLabel: 'Página 01',
    title: 'Doutrina da Proteção Integral',
    subtitle: 'Da situação irregular ao sujeito de direitos (Arts. 1º a 3º)',
    accentColor: 'blue',
    points: [
      {
        title: 'Antes vs. Depois de 1990',
        text: 'Supera o antigo Código de Menores e reconhece crianças e adolescentes como sujeitos de direitos em desenvolvimento.',
      },
      {
        title: 'Dever Compartilhado (Art. 4º)',
        text: 'Família, comunidade, sociedade em geral e Poder Público têm o dever conjunto de assegurar direitos com absoluta prioridade.',
      },
    ],
    legalBase: ['Art. 1º · Proteção integral', 'Art. 3º · Direitos sem discriminação', 'Art. 227 CF/88'],
    examTip: 'Criança: até 12 anos incompletos. Adolescente: entre 12 e 18 anos (Art. 2º).',
  },
  {
    id: 'sheet-2',
    moduleLabel: 'Módulo 01 · Fundamentos do ECA',
    pageLabel: 'Página 02',
    title: 'Prioridade Absoluta na Prática',
    subtitle: 'As 4 garantias constitucionais e do Art. 4º, parágrafo único',
    accentColor: 'cobalt',
    points: [
      {
        title: 'Primazia e Precedência',
        text: 'Primazia de receber proteção e socorro em quaisquer circunstâncias; precedência de atendimento nos serviços públicos.',
      },
      {
        title: 'Preferência e Orçamento',
        text: 'Preferência na formulação de políticas sociais e destinação privilegiada de recursos públicos para a infância.',
      },
    ],
    legalBase: ['Art. 4º, p. único, a-d', 'Art. 5º · Nenhuma negligência', 'Art. 6º · Interpretação'],
    examTip: 'Prioridade absoluta é regra obrigatória de atendimento e orçamento, nunca faculdade do gestor.',
  },
  {
    id: 'sheet-3',
    moduleLabel: 'Módulo 02 · Direitos Fundamentais',
    pageLabel: 'Página 07',
    title: 'Direito à Vida e à Saúde',
    subtitle: 'Do pré-natal ao atendimento integral no SUS (Arts. 7º a 14)',
    accentColor: 'cyan',
    points: [
      {
        title: 'Gestante e Nascimento',
        text: 'Acesso garantido ao pré-natal, acompanhamento psicológico, parto humanizado e permanência de acompanhante.',
      },
      {
        title: 'Comunicação Obrigatória',
        text: 'Suspeita ou confirmação de maus-tratos exige comunicação obrigatória ao Conselho Tutelar (Art. 13).',
      },
    ],
    legalBase: ['Art. 7º · Vida e saúde', 'Art. 8º · Pré-natal', 'Art. 13 · Notificação ao CT'],
    examTip: 'Médicos, professores e responsáveis que deixarem de comunicar maus-tratos cometem infração administrativa (Art. 245).',
  },
  {
    id: 'sheet-4',
    moduleLabel: 'Módulo 03 · Conselho Tutelar',
    pageLabel: 'Página 19',
    title: 'Atribuições do Art. 136',
    subtitle: 'O que o Conselho Tutelar faz vs. o que compete ao Juiz',
    accentColor: 'blue',
    points: [
      {
        title: 'Requisições Diretas',
        text: 'Requisitar serviços públicos nas áreas de saúde, educação, serviço social, previdência, trabalho e segurança.',
      },
      {
        title: 'Limites de Competência',
        text: 'Conselho Tutelar não aplica medida socioeducativa a adolescente (Art. 112) nem destitui poder familiar.',
      },
    ],
    legalBase: ['Art. 131 · Órgão permanente', 'Art. 136 · Atribuições', 'Art. 137 · Revisão judicial'],
    examTip: 'As decisões do Conselho Tutelar somente poderão ser revistas pela autoridade judiciária a pedido de quem tenha legítimo interesse.',
  },
]

export const KIT_MODULES: KitModuleItem[] = [
  {
    number: 'Módulo 01',
    title: 'Fundamentos do ECA',
    description:
      'Entenda a proteção integral, prioridade absoluta, definições legais e responsabilidades na garantia dos direitos.',
    image: publicAsset('/assets/module-cards/01-fundamentos-do-eca.webp'),
    iconName: 'BookOpen',
  },
  {
    number: 'Módulo 02',
    title: 'Direitos Fundamentais',
    description:
      'Estude os direitos à saúde, educação, liberdade, dignidade, convivência familiar e profissionalização.',
    image: publicAsset('/assets/module-cards/02-direitos-fundamentais.webp'),
    iconName: 'HeartHandshake',
  },
  {
    number: 'Módulo 03',
    title: 'Conselho Tutelar',
    description:
      'Conheça a organização, as atribuições, competências e os limites legais da atuação do Conselho Tutelar.',
    image: publicAsset('/assets/module-cards/03-conselho-tutelar.webp'),
    iconName: 'Scale',
  },
  {
    number: 'Módulo 04',
    title: 'Medidas de Proteção',
    description:
      'Compreenda quando aplicar medidas de proteção, quais são as previstas no ECA e como funcionam os encaminhamentos.',
    image: publicAsset('/assets/module-cards/04-medidas-de-protecao.webp'),
    iconName: 'ShieldCheck',
  },
  {
    number: 'Módulo 05',
    title: 'Família, Pais e Responsáveis',
    description:
      'Estude deveres familiares, medidas aplicáveis aos responsáveis, negligência, abandono e violência intrafamiliar.',
    image: publicAsset('/assets/module-cards/05-familia-pais-e-responsaveis.webp'),
    iconName: 'Users',
  },
  {
    number: 'Módulo 06',
    title: 'Rede de Proteção',
    description:
      'Entenda como atuam o Conselho Tutelar, CMDCA, CRAS, CREAS, Ministério Público e Poder Judiciário.',
    image: publicAsset('/assets/module-cards/06-rede-de-protecao.webp'),
    iconName: 'Waypoints',
  },
  {
    number: 'Módulo 07',
    title: 'Situações Práticas',
    description:
      'Acompanhe casos envolvendo evasão escolar, violência, negligência familiar, trabalho infantil e violência digital.',
    image: publicAsset('/assets/module-cards/07-situacoes-praticas.webp'),
    iconName: 'Lightbulb',
  },
  {
    number: 'Módulo 08',
    title: 'Revisão Visual e Provas',
    description:
      'Quadros comparativos, artigos campeões de cobrança e guia rápido para revisar antes da avaliação municipal.',
    image: publicAsset('/assets/module-cards/08-revisao-visual-e-provas.webp'),
    iconName: 'FileCheck2',
  },
]

export const KIT_STUDY_BENEFITS = [
  {
    title: 'Conteúdo organizado',
    description:
      'Os assuntos estão divididos por módulos para facilitar a construção de uma rotina de estudos.',
    iconName: 'Layers' as const,
  },
  {
    title: 'Explicações visuais',
    description:
      'Quadros, ilustrações e esquemas ajudam a compreender temas importantes da legislação.',
    iconName: 'Eye' as const,
  },
  {
    title: 'Situações práticas',
    description:
      'Exemplos permitem relacionar o conteúdo jurídico a situações que podem ocorrer na atuação do Conselho Tutelar.',
    iconName: 'Lightbulb' as const,
  },
  {
    title: 'Estude onde quiser',
    description:
      'Consulte os PDFs pelo celular, computador ou tablet e imprima quando preferir.',
    iconName: 'Smartphone' as const,
  },
]

export const KIT_TARGET_GOALS: string[] = [
  'Começar a estudar para o processo de escolha de Conselheiro Tutelar 2027.',
  'Revisar os principais direitos previstos no ECA com mapas visuais.',
  'Entender melhor as atribuições e limites legais do Conselho Tutelar.',
  'Organizar os estudos com materiais de consulta rápida em PDF.',
  'Praticar a interpretação de situações envolvendo direitos de crianças e adolescentes.',
]

export const REAL_PAGE_PREVIEWS: RealPagePreview[] = [
  {
    id: 'p01',
    category: 'mod1-4',
    moduleLabel: 'Módulo 01 · Fundamentos',
    pageLabel: 'Amostra 01',
    title: 'Da situação irregular à proteção integral',
    image: publicAsset('/assets/kit-previews/pagina-01.jpg'),
  },
  {
    id: 'p03',
    category: 'mod1-4',
    moduleLabel: 'Módulo 01 · Fundamentos',
    pageLabel: 'Amostra 02',
    title: 'Prioridade Absoluta: As 4 Garantias',
    image: publicAsset('/assets/kit-previews/pagina-03.jpg'),
  },
  {
    id: 'p17',
    category: 'mod1-4',
    moduleLabel: 'Módulo 03 · Conselho Tutelar',
    pageLabel: 'Amostra 03',
    title: 'Atribuições Diretas (Art. 136, I a IV)',
    image: publicAsset('/assets/kit-previews/pagina-17.jpg'),
  },
  {
    id: 'b02',
    category: 'bonus',
    moduleLabel: 'Bônus 02 · Kit Premium',
    pageLabel: 'Amostra Bônus',
    title: 'Mapa Visual: Fundamentos e Idades',
    image: publicAsset('/assets/kit-previews/bonus-02-mapa-01.jpg'),
  },
]

export const KIT_BONUSES: KitBonusItem[] = [
  {
    code: 'BÔNUS 01',
    title: 'Cronograma de Estudos de 14 Dias',
    description:
      'Um planejamento diário para organizar os estudos dos módulos, com revisões, metas e checklist de acompanhamento.',
    image: publicAsset('/assets/module-cards/bonus-01-cronograma-14-dias.webp'),
    iconName: 'CalendarDays',
  },
  {
    code: 'BÔNUS 02',
    title: 'Mapas Visuais dos Artigos Essenciais do ECA',
    description:
      'Uma coleção de 8 mapas visuais com os principais artigos do Estatuto da Criança e do Adolescente, incluindo direitos fundamentais, medidas de proteção e atribuições.',
    image: publicAsset('/assets/module-cards/bonus-02-mapas-visuais-eca.webp'),
    iconName: 'Map',
  },
  {
    code: 'BÔNUS 03',
    title: 'Checklist do Candidato ao Conselho Tutelar',
    description:
      'Material para acompanhar a preparação, com listas de conteúdos estudados, requisitos para candidatura, documentos e etapas do processo de escolha de 2027.',
    image: publicAsset('/assets/module-cards/bonus-03-checklist-do-candidato.webp'),
    iconName: 'CheckSquare',
  },
]

export const KIT_TIERS: KitTier[] = [
  {
    id: 'basico',
    name: 'KIT BÁSICO',
    price: 15,
    priceFormatted: '15,00',
    features: [
      'Módulos de fundamentos do ECA',
      'Explicações ilustradas',
      'Arquivos digitais em PDF',
      'Estudo no celular, computador ou impresso',
    ],
    ctaLabel: 'Quero o Kit Básico',
  },
  {
    id: 'premium',
    name: 'KIT PREMIUM',
    badge: 'MAIS ESCOLHIDO',
    price: 27.9,
    priceFormatted: '27,90',
    features: [
      'Tudo do Kit Básico: fundamentos do ECA explicados passo a passo',
      'Quadros ilustrados que facilitam a memorização dos artigos mais cobrados',
      'Arquivos digitais em PDF (celular, computador ou impresso)',
      '8 módulos de estudos completos (50 páginas visuais)',
      'Mapas visuais e quadros de revisão',
      'Estudos de situações práticas',
      '3 Bônus exclusivos (Cronograma 14 dias, 8 Mapas Visuais e Checklist 2027)',
    ],
    ctaLabel: 'Quero o Kit Premium',
  },
]

export const KIT_FAQS: KitFaqItem[] = [
  {
    id: 'kfaq-1',
    question: 'O material é físico ou digital?',
    answer:
      'O kit é 100% digital. Os materiais são disponibilizados em arquivos PDF, que podem ser acessados em dispositivos compatíveis e impressos.',
  },
  {
    id: 'kfaq-2',
    question: 'O material serve para quem está começando a estudar?',
    answer:
      'Sim. Os conteúdos foram organizados em 8 módulos, começando pelos fundamentos do ECA e avançando para atribuições do Conselho Tutelar, medidas de proteção e situações práticas.',
  },
  {
    id: 'kfaq-3',
    question: 'O kit é específico para a seleção de Conselheiro Tutelar de 2027?',
    answer:
      'O material foi pensado para apoiar a preparação para o processo de escolha de 2027 com conteúdos de base nacional (Lei nº 8.069/90). É importante conferir as regras e matérias específicas do edital do seu município.',
  },
  {
    id: 'kfaq-4',
    question: 'O kit garante minha aprovação?',
    answer:
      'Não. O material é uma ferramenta de estudo e revisão. A aprovação ou habilitação depende da preparação individual e das regras de cada seleção municipal.',
  },
  {
    id: 'kfaq-5',
    question: 'Posso estudar pelo celular e imprimir em casa?',
    answer:
      'Sim. Os materiais são em PDF em formato vertical A4, adequados tanto para leitura no celular, tablet e computador quanto para impressão.',
  },
  {
    id: 'kfaq-6',
    question: 'Como receberei o material após o pagamento no Pix?',
    answer:
      'Após realizar o Pix para a chave CNPJ 68.138.039/0001-03 e enviar o comprovante no WhatsApp (51) 8571-6039 (ou após a confirmação na plataforma), o acesso aos PDFs é liberado diretamente para você.',
  },
  {
    id: 'kfaq-7',
    question: 'Tenho garantia?',
    answer:
      'Sim. Você conta com 7 dias de garantia para conhecer o material e conferir se ele atende às suas expectativas.',
  },
]
