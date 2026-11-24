export interface SessionItem {
  day: string;
  title: string;
  timezoneLabel: string;
  desc: string;
  utcHour: number;
  utcMinute: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface QuickPrompt {
  label: string;
  val: string;
}

export interface TenantConfig {
  whopCompanyId: string;
  planStatus: 'trial' | 'active' | 'past_due';
  brand: {
    appName: string;
    appSubName: string;
    topBanner: string;
    badgeText: string;
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    primaryColor: string;
    accentColor: string;
    bgColor: string;
    cardColor: string;
    textColor: string;
    logoUrl: string;
    zoomUrl: string;
    zoomButtonText: string;
  };
  content: {
    programs: string[];
    sessionsTitle: string;
    sessionsSubtitle: string;
    sessions: SessionItem[];
    faqs: FaqItem[];
    quickPrompts: QuickPrompt[];
    sideCardTitle: string;
    sideCardDesc: string;
  };
  integrations: {
    telegramBotToken: string;
    telegramChatId: string;
    webhookUrl: string;
    aiSystemPrompt: string;
  };
}

export const DEFAULT_TENANT_CONFIG: TenantConfig = {
  whopCompanyId: 'demo-company',
  planStatus: 'trial',
  brand: {
    appName: 'SERVE',
    appSubName: 'SERVICIOS EMPRESARIALES DE ÉLITE',
    topBanner: 'SISTEMA · ESTRATEGIA · RESULTADOS · VALOR · ÉLITE',
    badgeText: 'Acompañamiento Operativo Activo',
    heroTitle: 'Sistemas que Impulsan',
    heroHighlight: 'Resultados.',
    heroSubtitle:
      'Disciplina en el diseño, precisión en la ejecución. Resuelve tus dudas operativas, consulta horarios en vivo o abre un ticket prioritario.',
    primaryColor: '#B89A60', // Oro Imperial
    accentColor: '#D8BC83',  // Champagne
    bgColor: '#0B0A09',      // Obsidian
    cardColor: '#201E1A',    // Grafito
    textColor: '#E8E1D4',    // Marfil
    logoUrl: '',
    zoomUrl: 'https://zoom.us',
    zoomButtonText: 'Sala en Vivo',
  },
  content: {
    programs: [
      'Membresía General',
      'Programa Intensivo / Mentoría',
      'Dudas de Facturación o Acceso',
      'Otro / Consulta General',
    ],
    sessionsTitle: 'Sesiones en Vivo Semanales',
    sessionsSubtitle: 'Horario oficial · Conversión automática a tu zona horaria',
    sessions: [
      {
        day: 'Martes',
        title: 'SESIÓN DE ESTRATEGIA',
        timezoneLabel: '10:00 AM (ET)',
        desc: 'Resolución de dudas en directo',
        utcHour: 15,
        utcMinute: 0,
      },
      {
        day: 'Jueves',
        title: 'AUDITORÍA OPERATIVA',
        timezoneLabel: '7:00 PM (ET)',
        desc: 'Implementación paso a paso',
        utcHour: 0,
        utcMinute: 0,
      },
    ],
    faqs: [
      {
        q: '¿Dónde encuentro las grabaciones de las sesiones?',
        a: 'Puedes acceder a todas las sesiones anteriores desde la pestaña de Grabaciones dentro de tu panel de Whop.',
      },
      {
        q: '¿Tengo problemas para desbloquear algún módulo?',
        a: 'Abre una solicitud en el formulario indicando el correo con el que te registraste en Whop y te habilitaremos el acceso.',
      },
    ],
    quickPrompts: [
      { label: 'Horarios en Vivo', val: '¿En qué días y horarios son las sesiones en vivo?' },
      { label: 'Acceso a Grabaciones', val: 'Tengo un problema para ver las grabaciones en Whop' },
    ],
    sideCardTitle: 'Atención & Ejecución',
    sideCardDesc:
      'Acompañamiento dedicado para destrabar tus dudas operativas y asegurar resultados consistentes dentro de tu membresía.',
  },
  integrations: {
    telegramBotToken: '',
    telegramChatId: '',
    webhookUrl: '',
    aiSystemPrompt:
      'Eres el asistente de soporte oficial. Responde de forma ejecutiva, directa y precisa antes de escalar el caso a un humano.',
  },
};