'use client';

import React, { useState, useEffect } from 'react';
import { TenantConfig } from '@/types/tenant';

interface SupportPortalProps {
  config: TenantConfig;
  experienceId?: string;
  isPreview?: boolean;
}

export default function SupportPortal({
  config,
  experienceId = 'PREVIEW',
  isPreview = false,
}: SupportPortalProps) {
  const { brand, content } = config;

  const [program, setProgram] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [botAnswer, setBotAnswer] = useState('');
  const [status, setStatus] = useState<'initial' | 'resolved' | 'escalated'>('initial');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [userTimeZone, setUserTimeZone] = useState<string>('');

  useEffect(() => {
    try {
      setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setUserTimeZone('Local');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const getLocalSessionTime = (utcHour: number, utcMinute: number) => {
    if (!userTimeZone) return '';
    const now = new Date();
    const utcDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), utcHour, utcMinute)
    );
    return new Intl.DateTimeFormat('es-MX', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(utcDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !program || !message.trim()) return;

    const code = 'SRV-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    setCaseId(code);
    setSubmittedName(name.trim().split(/\s+/)[0]);
    setStatus('initial');
    setHasSubmitted(true);

    if (isPreview) {
      setBotAnswer(
        `[Vista Previa] Aquí responderá tu Asistente IA usando tu prompt personalizado: "${config.integrations.aiSystemPrompt.slice(0, 90)}..."`
      );
      showToast('Simulación de ticket enviada (Modo Preview)');
      return;
    }

    setBotAnswer('Analizando tu consulta con nuestro asistente...');
    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: config.whopCompanyId,
          experienceId,
          caseId: code,
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          program,
          message: message.trim(),
          type: 'ticket',
        }),
      });
      const data = await res.json();
      setBotAnswer(
        data.aiOrientation ||
          'Hemos registrado tu solicitud. Si necesitas atención directa de un especialista, pulsa "Escalar a Soporte Humano".'
      );
      showToast('Solicitud enviada al equipo.');
    } catch {
      setBotAnswer('Solicitud registrada. Nuestro equipo revisará tu caso a la brevedad.');
    }
  };

  const gradientBg = `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.accentColor} 100%)`;
  const surfaceBg = brand.cardColor || '#201E1A';
  const inputBg = brand.bgColor || '#0B0A09';
  const textPrimary = brand.textColor || '#E8E1D4';
  const borderSubtle = `${brand.primaryColor}33`;

  const bgHex = inputBg.toLowerCase();
  const isDarkBg = bgHex === '#0b0a09' || bgHex === '#060b14' || bgHex === '#050807';
  const heroTextColor = isDarkBg ? '#E8E1D4' : '#0B0A09';

  return (
    <main
      style={{
        minHeight: '100%',
        backgroundColor: inputBg,
        color: textPrimary,
        fontFamily: 'var(--font-manrope), -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Banner superior */}
      {brand.topBanner && (
        <div
          style={{
            backgroundColor: isDarkBg ? '#12110F' : '#EFECE4',
            borderBottom: `1px solid ${borderSubtle}`,
            color: heroTextColor,
            textAlign: 'center',
            padding: '8px 16px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: brand.primaryColor, marginRight: '8px', fontWeight: 700 }}>{brand.appName}</span>
          <span style={{ color: brand.accentColor }}>{brand.appName}</span>
          <span style={{ opacity: 0.75 }}>{brand.topBanner}</span>
        </div>
      )}

      {/* Header */}
      <header
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          height: '84px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${borderSubtle}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={brand.appName}
              style={{ width: '46px', height: '46px', objectFit: 'contain', borderRadius: '8px' }}
            />
          ) : (
            <svg viewBox="0 0 40 48" style={{ width: '36px', height: '42px' }} fill="none">
              <path
                d="M20 2L25 12H22V16H31L26 22H22V27H29V39H22V46L17 36H20V33H11L16 27H20V22H13V10H20V2Z"
                fill={brand.accentColor}
              />
            </svg>
          )}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-rajdhani), sans-serif',
                fontSize: '24px',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '0.22em',
              }}
            >
              <span style={{ color: brand.primaryColor }}>
             {brand.appName}
           </span>
            </div>
            {brand.appSubName && (
              <div
                style={{
                  marginTop: '5px',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.24em',
                  color: brand.primaryColor,
                  lineHeight: 1,
                }}
              >
                {brand.appSubName}
              </div>
            )}
          </div>
        </div>

        {brand.zoomUrl && (
          <a
            href={brand.zoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: gradientBg,
              color: '#0B0A09',
              textDecoration: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#0B0A09',
              }}
            />
            {brand.zoomButtonText || 'Sala en Vivo'}
          </a>
        )}
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '38px 24px 72px' }}>
        {/* Bloque de Sesiones en Vivo */}
        {content.sessions.length > 0 && (
          <div
            style={{
              backgroundColor: surfaceBg,
              border: `1px solid ${borderSubtle}`,
              borderRadius: '14px',
              padding: '22px 24px',
              marginBottom: '32px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '14px', color: textPrimary, display: 'block' }}>
                {content.sessionsTitle}
              </strong>
              <span style={{ fontSize: '11px', opacity: 0.65 }}>{content.sessionsSubtitle}</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {content.sessions.map((sess, idx) => {
                const localTime = getLocalSessionTime(sess.utcHour, sess.utcMinute);
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: inputBg,
                      border: `1px solid ${borderSubtle}`,
                      borderRadius: '10px',
                      padding: '14px 16px',
                      color: heroTextColor,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: brand.accentColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '4px',
                      }}
                    >
                      {sess.day}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-rajdhani), sans-serif',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: heroTextColor,
                        marginBottom: '4px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {sess.title}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.75 }}>{sess.timezoneLabel}</div>
                    {localTime && (
                      <div style={{ fontSize: '10px', color: brand.primaryColor, marginTop: '3px', fontWeight: 600 }}>
                        Tu hora local: {localTime}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hero */}
        <section style={{ marginBottom: '34px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: brand.primaryColor,
              backgroundColor: `${brand.primaryColor}18`,
              border: `1px solid ${brand.primaryColor}45`,
              padding: '6px 14px',
              borderRadius: '99px',
              marginBottom: '14px',
            }}
          >
            {brand.badgeText}
          </span>
          {(() => {
  const highlight = (brand.heroHighlight || '').trim();
  const rawTitle = (brand.heroTitle || '').trim();
  const baseTitle =
    highlight && rawTitle.toLowerCase().endsWith(highlight.toLowerCase())
      ? rawTitle.slice(0, -highlight.length).trim()
      : rawTitle;

  return (
    <h1
      style={{
        fontFamily: 'var(--font-rajdhani), sans-serif',
        fontSize: 'clamp(30px, 4vw, 44px)',
        fontWeight: 700,
        margin: '0 0 10px',
        color: heroTextColor,
        lineHeight: 1.1,
      }}
    >
      {baseTitle}{' '}
      {highlight && (
        <span style={{ color: brand.primaryColor }}>{highlight}</span>
      )}
        </h1>
        );
         })()}
          <p style={{ color: heroTextColor, opacity: 0.75, fontSize: '15px', lineHeight: 1.6, margin: 0, maxWidth: '720px' }}>
            {brand.heroSubtitle}
          </p>
        </section>

        {/* Grid principal: Formulario + FAQs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          <section>
            <div
              style={{
                backgroundColor: surfaceBg,
                border: `1px solid ${borderSubtle}`,
                borderRadius: '14px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: gradientBg }} />

              <h2
                style={{
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  margin: '0 0 18px',
                  color: textPrimary,
                }}
              >
                Abre una solicitud
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', opacity: 0.85 }}>
                    Categoría / Programa
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      border: `1px solid ${borderSubtle}`,
                      borderRadius: '10px',
                      backgroundColor: inputBg,
                      padding: '12px 14px',
                      color: heroTextColor,
                      fontSize: '13px',
                    }}
                  >
                    <option value="" disabled>
                      Selecciona una opción…
                    </option>
                    {content.programs.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      border: `1px solid ${borderSubtle}`,
                      borderRadius: '10px',
                      backgroundColor: inputBg,
                      padding: '12px 14px',
                      color: heroTextColor,
                      fontSize: '13px',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Correo en Whop"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      border: `1px solid ${borderSubtle}`,
                      borderRadius: '10px',
                      backgroundColor: inputBg,
                      padding: '12px 14px',
                      color: heroTextColor,
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="tel"
                    placeholder="WhatsApp (+52 55 1234 5678)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    style={{
                      width: '100%',
                      border: `1px solid ${borderSubtle}`,
                      borderRadius: '10px',
                      backgroundColor: inputBg,
                      padding: '12px 14px',
                      color: heroTextColor,
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <textarea
                    rows={3}
                    placeholder="Describe tu consulta..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      border: `1px solid ${borderSubtle}`,
                      borderRadius: '10px',
                      backgroundColor: inputBg,
                      padding: '12px 14px',
                      color: heroTextColor,
                      fontSize: '13px',
                    }}
                  />
                  {content.quickPrompts.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {content.quickPrompts.map((btn) => (
                        <button
                          type="button"
                          key={btn.label}
                          onClick={() => setMessage(btn.val)}
                          style={{
                            border: `1px solid ${borderSubtle}`,
                            borderRadius: '99px',
                            padding: '5px 12px',
                            backgroundColor: inputBg,
                            color: brand.accentColor,
                            fontSize: '11px',
                            cursor: 'pointer',
                          }}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    border: 'none',
                    background: gradientBg,
                    color: '#0B0A09',
                    padding: '14px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Enviar Solicitud
                </button>
              </form>
            </div>

            {hasSubmitted && (
              <div
                style={{
                  marginTop: '20px',
                  backgroundColor: surfaceBg,
                  border: `1px solid ${borderSubtle}`,
                  borderRadius: '14px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px' }}>Ticket de {submittedName}</strong>
                  <span style={{ fontFamily: 'monospace', color: brand.primaryColor, fontSize: '12px' }}>
                    {caseId}
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: inputBg,
                    border: `1px solid ${borderSubtle}`,
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '13px',
                    color: heroTextColor,
                    lineHeight: 1.55,
                    marginBottom: '12px',
                  }}
                >
                  {botAnswer}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setStatus('resolved')}
                    style={{
                      backgroundColor: inputBg,
                      border: `1px solid ${borderSubtle}`,
                      color: status === 'resolved' ? '#34d399' : heroTextColor,
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    ✓ Resuelto
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('escalated')}
                    style={{
                      backgroundColor: inputBg,
                      border: `1px solid ${borderSubtle}`,
                      color: status === 'escalated' ? brand.accentColor : heroTextColor,
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Escalar a Humano
                  </button>
                </div>
              </div>
            )}
          </section>

          <aside style={{ display: 'grid', gap: '18px' }}>
            <div style={{ backgroundColor: surfaceBg, border: `1px solid ${borderSubtle}`, borderRadius: '14px', padding: '22px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  margin: '0 0 6px',
                }}
              >
                {content.sideCardTitle}
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.55, opacity: 0.75, margin: 0 }}>{content.sideCardDesc}</p>
            </div>

            {content.faqs.length > 0 && (
              <div style={{ backgroundColor: surfaceBg, border: `1px solid ${borderSubtle}`, borderRadius: '14px', padding: '22px' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-rajdhani), sans-serif',
                    fontSize: '18px',
                    fontWeight: 700,
                    margin: '0 0 12px',
                  }}
                >
                  Preguntas Frecuentes
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {content.faqs.map((item, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={idx} style={{ backgroundColor: inputBg, border: `1px solid ${borderSubtle}`, borderRadius: '9px' }}>
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: heroTextColor,
                            fontSize: '12px',
                            fontWeight: 600,
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                        >
                          <span>{item.q}</span>
                          <span style={{ color: brand.accentColor, fontWeight: 700 }}>{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: '0 14px 12px', fontSize: '12px', color: heroTextColor, opacity: 0.75, lineHeight: 1.5 }}>
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: surfaceBg,
            border: `1px solid ${brand.primaryColor}`,
            color: textPrimary,
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}
    </main>
  );
}