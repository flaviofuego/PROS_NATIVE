import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Página no encontrada</h1>
        <p className="text-slate-500">La ruta solicitada no existe.</p>
        <Link href="/">
          <Button>Ir al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
