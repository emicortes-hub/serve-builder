import { Suspense } from 'react';
import BuilderWorkspace from '@/components/builder/BuilderWorkspace';

export default function BuilderCompanyPage() {
  return (
    <Suspense fallback={<p>Cargando el editor…</p>}>
      <BuilderWorkspace />
    </Suspense>
  );
}