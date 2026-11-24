'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DEFAULT_TENANT_CONFIG, TenantConfig } from '@/types/tenant';
import SupportPortal from '@/components/portal/SupportPortal';
import { Palette, ListChecks, Webhook, Rocket, Plus, Trash2 } from 'lucide-react';

export default function BuilderWorkspace() {
  const params = useParams();
  const companyId = (params?.companyId as string) || 'demo-company';

  const [config, setConfig] = useState<TenantConfig>({
    ...DEFAULT_TENANT_CONFIG,
    whopCompanyId: companyId,
  });
  const [activeTab, setActiveTab] = useState<'brand' | 'content' | 'integrations'>('brand');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!companyId || companyId === 'demo-company') return;
    fetch(`/api/tenant/config?companyId=${companyId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.brand) setConfig(data);
      })
      .catch(() => {});
  }, [companyId]);

  const handleSaveAndPublish = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/tenant/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, whopCompanyId: companyId }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      alert('Configuración guardada y publicada.');
    } catch {
      alert('No se pudo guardar en Supabase. Revisa tus variables en .env.local.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0A09] text-[#0B0A09] overflow-hidden">
      {/* PANEL IZQUIERDO EN MARFIL CREMA (#E8E1D4) */}
      <aside className="w-[420px] border-r border-[#B89A60]/30 flex flex-col bg-[#E8E1D4]">
        <div className="p-5 border-b border-[#0B0A09]/10 flex items-center justify-between bg-[#EFECE4]">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 48" className="w-7 h-8 shrink-0" fill="none">
              <path
                d="M20 2L25 12H22V16H31L26 22H22V27H29V39H22V46L17 36H20V33H11L16 27H20V22H13V10H20V2Z"
                fill="#0B0A09"
              />
            </svg>
            <div>
              <span
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
                className="text-sm font-bold tracking-[0.22em] text-[#8C703C] uppercase block leading-none"
              >
                SERVE BUILDER
              </span>
              <h1 className="text-base font-bold text-[#0B0A09] mt-1">Configura tu Portal</h1>
            </div>
          </div>
          <span className="text-[11px] bg-[#0B0A09] px-2.5 py-1 rounded-md font-mono text-[#D8BC83]">
            {companyId}
          </span>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-[#0B0A09]/10 text-xs font-bold bg-[#E8E1D4]">
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'brand'
                ? 'border-[#0B0A09] text-[#0B0A09] bg-[#F6F3EC]'
                : 'border-transparent text-[#0B0A09]/50 hover:text-[#0B0A09]'
            }`}
          >
            <Palette size={14} /> Marca
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'content'
                ? 'border-[#0B0A09] text-[#0B0A09] bg-[#F6F3EC]'
                : 'border-transparent text-[#0B0A09]/50 hover:text-[#0B0A09]'
            }`}
          >
            <ListChecks size={14} /> Contenido
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('integrations')}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'integrations'
                ? 'border-[#0B0A09] text-[#0B0A09] bg-[#F6F3EC]'
                : 'border-transparent text-[#0B0A09]/50 hover:text-[#0B0A09]'
            }`}
          >
            <Webhook size={14} /> Conexiones
          </button>
        </div>

        {/* Controles */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {activeTab === 'brand' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">Nombre de tu Marca</label>
                <input
                  type="text"
                  value={config.brand.appName}
                  onChange={(e) =>
                    setConfig({ ...config, brand: { ...config.brand, appName: e.target.value } })
                  }
                  className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 focus:border-[#0B0A09] outline-none rounded-lg px-3 py-2 text-[#0B0A09] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">Subtítulo de Marca</label>
                <input
                  type="text"
                  value={config.brand.appSubName}
                  onChange={(e) =>
                    setConfig({ ...config, brand: { ...config.brand, appSubName: e.target.value } })
                  }
                  className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 focus:border-[#0B0A09] outline-none rounded-lg px-3 py-2 text-[#0B0A09]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">Título Principal</label>
                <input
                  type="text"
                  value={config.brand.heroTitle}
                  onChange={(e) =>
                    setConfig({ ...config, brand: { ...config.brand, heroTitle: e.target.value } })
                  }
                  className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 focus:border-[#0B0A09] outline-none rounded-lg px-3 py-2 text-[#0B0A09]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">Palabra Destacada</label>
                <input
                  type="text"
                  value={config.brand.heroHighlight}
                  onChange={(e) =>
                    setConfig({ ...config, brand: { ...config.brand, heroHighlight: e.target.value } })
                  }
                  className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 focus:border-[#0B0A09] outline-none rounded-lg px-3 py-2 text-[#0B0A09] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={config.brand.heroSubtitle}
                  onChange={(e) =>
                    setConfig({ ...config, brand: { ...config.brand, heroSubtitle: e.target.value } })
                  }
                  className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 focus:border-[#0B0A09] outline-none rounded-lg px-3 py-2 text-[#0B0A09]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">Color Primario</label>
                  <input
                    type="color"
                    value={config.brand.primaryColor}
                    onChange={(e) =>
                      setConfig({ ...config, brand: { ...config.brand, primaryColor: e.target.value } })
                    }
                    className="w-full h-10 rounded cursor-pointer bg-[#F6F3EC] border border-[#0B0A09]/15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">Color Acento</label>
                  <input
                    type="color"
                    value={config.brand.accentColor}
                    onChange={(e) =>
                      setConfig({ ...config, brand: { ...config.brand, accentColor: e.target.value } })
                    }
                    className="w-full h-10 rounded cursor-pointer bg-[#F6F3EC] border border-[#0B0A09]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">URL Sala en Vivo (Zoom / Meet)</label>
                <input
                  type="url"
                  value={config.brand.zoomUrl}
                  onChange={(e) =>
                    setConfig({ ...config, brand: { ...config.brand, zoomUrl: e.target.value } })
                  }
                  className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 focus:border-[#0B0A09] outline-none rounded-lg px-3 py-2 text-[#0B0A09]"
                />
              </div>
            </>
          )}

          {activeTab === 'content' && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0B0A09]/80">Categorías / Programas</label>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        content: {
                          ...config.content,
                          programs: [...config.content.programs, 'Nuevo Programa'],
                        },
                      })
                    }
                    className="text-xs font-bold text-[#8C703C] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus size={13} /> Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {config.content.programs.map((prog, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={prog}
                        onChange={(e) => {
                          const updated = [...config.content.programs];
                          updated[i] = e.target.value;
                          setConfig({ ...config, content: { ...config.content, programs: updated } });
                        }}
                        className="flex-1 bg-[#F6F3EC] border border-[#0B0A09]/15 rounded-lg px-3 py-1.5 text-xs text-[#0B0A09]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.content.programs.filter((_, idx) => idx !== i);
                          setConfig({ ...config, content: { ...config.content, programs: updated } });
                        }}
                        className="text-[#0B0A09]/40 hover:text-red-600 p-1.5 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0B0A09]/80">Preguntas Frecuentes (FAQ)</label>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        content: {
                          ...config.content,
                          faqs: [...config.content.faqs, { q: 'Nueva pregunta', a: 'Respuesta...' }],
                        },
                      })
                    }
                    className="text-xs font-bold text-[#8C703C] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus size={13} /> Agregar FAQ
                  </button>
                </div>
                <div className="space-y-3">
                  {config.content.faqs.map((faq, i) => (
                    <div key={i} className="p-3 bg-[#F6F3EC] border border-[#0B0A09]/15 rounded-lg space-y-2">
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => {
                          const updated = [...config.content.faqs];
                          updated[i] = { ...updated[i], q: e.target.value };
                          setConfig({ ...config, content: { ...config.content, faqs: updated } });
                        }}
                        className="w-full bg-white border border-[#0B0A09]/10 rounded px-2.5 py-1 text-xs font-bold text-[#0B0A09]"
                      />
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => {
                          const updated = [...config.content.faqs];
                          updated[i] = { ...updated[i], a: e.target.value };
                          setConfig({ ...config, content: { ...config.content, faqs: updated } });
                        }}
                        className="w-full bg-white border border-[#0B0A09]/10 rounded px-2.5 py-1 text-xs text-[#0B0A09]/80"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'integrations' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">
                  Instrucciones del Asistente IA (System Prompt)
                </label>
                <textarea
                  rows={4}
                  value={config.integrations.aiSystemPrompt}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      integrations: { ...config.integrations, aiSystemPrompt: e.target.value },
                    })
                  }
                  className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 rounded-lg px-3 py-2 text-xs text-[#0B0A09]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">
                  Webhook URL (GoHighLevel / n8n / Make)
                </label>
                <input
                  type="url"
                  placeholder="https://services.leadconnectorhq.com/hooks/..."
                  value={config.integrations.webhookUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      integrations: { ...config.integrations, webhookUrl: e.target.value },
                    })
                  }
                  className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 rounded-lg px-3 py-2 text-xs text-[#0B0A09]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">Telegram Bot Token</label>
                  <input
                    type="password"
                    placeholder="123456:ABC-DEF..."
                    value={config.integrations.telegramBotToken}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        integrations: { ...config.integrations, telegramBotToken: e.target.value },
                      })
                    }
                    className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 rounded-lg px-3 py-2 text-xs text-[#0B0A09]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B0A09]/80 mb-1">Telegram Chat ID</label>
                  <input
                    type="text"
                    placeholder="-100123456789"
                    value={config.integrations.telegramChatId}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        integrations: { ...config.integrations, telegramChatId: e.target.value },
                      })
                    }
                    className="w-full bg-[#F6F3EC] border border-[#0B0A09]/15 rounded-lg px-3 py-2 text-xs text-[#0B0A09]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#0B0A09]/10 bg-[#EFECE4]">
          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={saving}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0B0A09] hover:bg-[#201E1A] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg cursor-pointer text-[#D8BC83]"
          >
            <Rocket size={15} />
            {saving ? 'Guardando...' : 'Guardar y Publicar en Whop'}
          </button>
        </div>
      </aside>

      {/* PANEL DERECHO: VISTA PREVIA */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <div className="h-11 bg-[#12110F] border-b border-[#B89A60]/20 px-4 flex items-center justify-between text-xs text-[#E8E1D4]/70">
          <span>Vista Previa en Vivo (Así lo verán tus miembros en Whop)</span>
          <span className="text-[#D8BC83] font-semibold">● Sincronizado</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SupportPortal config={config} isPreview={true} />
        </div>
      </section>
    </div>
  );
}