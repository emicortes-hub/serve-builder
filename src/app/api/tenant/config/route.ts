import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { DEFAULT_TENANT_CONFIG } from '@/types/tenant';

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('companyId');
  if (!companyId) return NextResponse.json({ error: 'Falta companyId' }, { status: 400 });

  const { data } = await supabaseAdmin
    .from('serve_tenants')
    .select('*')
    .eq('whop_company_id', companyId)
    .single();

  if (!data) {
    return NextResponse.json({ ...DEFAULT_TENANT_CONFIG, whopCompanyId: companyId });
  }

  return NextResponse.json({
    whopCompanyId: data.whop_company_id,
    planStatus: data.plan_status,
    brand: { ...DEFAULT_TENANT_CONFIG.brand, ...data.brand_config },
    content: { ...DEFAULT_TENANT_CONFIG.content, ...data.content_config },
    integrations: { ...DEFAULT_TENANT_CONFIG.integrations, ...data.integrations_config },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.whopCompanyId) {
    return NextResponse.json({ error: 'Falta whopCompanyId' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('serve_tenants').upsert(
    {
      whop_company_id: body.whopCompanyId,
      brand_config: body.brand,
      content_config: body.content,
      integrations_config: body.integrations,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'whop_company_id' }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}