import React, { Suspense } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { DEFAULT_TENANT_CONFIG, TenantConfig } from '@/types/tenant';
import SupportPortal from '@/components/portal/SupportPortal';

interface ExperiencePageProps {
  params: Promise<{ experienceId: string }>;
  searchParams: Promise<{ companyId?: string }>;
}

async function ExperienceLoader({ params, searchParams }: ExperiencePageProps) {
  const { experienceId } = await params;
  const { companyId } = await searchParams;
  const targetCompanyId = companyId || experienceId;

  const { data } = await supabaseAdmin
    .from('serve_tenants')
    .select('*')
    .eq('whop_company_id', targetCompanyId)
    .single();

  const tenantConfig: TenantConfig = data
    ? {
        whopCompanyId: data.whop_company_id,
        planStatus: data.plan_status,
        brand: { ...DEFAULT_TENANT_CONFIG.brand, ...data.brand_config },
        content: { ...DEFAULT_TENANT_CONFIG.content, ...data.content_config },
        integrations: { ...DEFAULT_TENANT_CONFIG.integrations, ...data.integrations_config },
      }
    : { ...DEFAULT_TENANT_CONFIG, whopCompanyId: targetCompanyId };

  return <SupportPortal config={tenantConfig} experienceId={experienceId} isPreview={false} />;
}

export default function WhopExperiencePage(props: ExperiencePageProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-[#0B0A09] text-[#D8BC83] flex items-center justify-center text-sm tracking-widest uppercase">
          Cargando Portal de Soporte...
        </div>
      }
    >
      <ExperienceLoader {...props} />
    </Suspense>
  );
}