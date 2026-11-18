'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
// React escapa todo texto automaticamente (anti-XSS); nunca usamos dangerouslySetInnerHTML.
export default function Gallery({ items }: { items: any[] }) {
  const [o, setO] = useState<any>(null);
  return (<>
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {items.map(i => (
        <button key={i.id} onClick={() => setO(i)} className="card block w-full mb-4 break-inside-avoid text-left overflow-hidden">
          <img src={i.url} alt={i.title || ''} loading="lazy" className="w-full" />
          <div className="p-3"><p className="font-titulo font-bold">{i.title}</p><p className="text-sm opacity-70">{i.turma}</p></div>
        </button>))}
    </div>
    {o && <div role="dialog" aria-modal className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4" onClick={() => setO(null)}>
      <button aria-label="Fechar" className="absolute top-4 right-4"><X /></button>
      <img src={o.url} alt={o.title || ''} className="max-h-[80vh] max-w-full object-contain" />
      <p className="mt-3 font-titulo text-xl">{o.title}</p><p className="opacity-70">{[o.caption, o.turma].filter(Boolean).join(' – ')}</p>
    </div>}
  </>);
}
