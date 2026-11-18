'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
type F = { k: string; l: string; t?: 'area' | 'check' | 'file' };
const TABS: Record<string, { fields: F[]; order: string }> = {
  images: { order: 'sort_order', fields: [{ k: 'url', l: 'Foto (máx. 5 MB)', t: 'file' }, { k: 'title', l: 'Título' }, { k: 'caption', l: 'Legenda' }, { k: 'turma', l: 'Turma' }, { k: 'sort_order', l: 'Ordem' }, { k: 'published', l: 'Publicado', t: 'check' }] },
  videos: { order: 'sort_order', fields: [{ k: 'url', l: 'Link YouTube/Vimeo' }, { k: 'title', l: 'Título' }, { k: 'category', l: 'Categoria' }, { k: 'description', l: 'Descrição', t: 'area' }, { k: 'sort_order', l: 'Ordem' }, { k: 'published', l: 'Publicado', t: 'check' }] },
  poems: { order: 'created_at', fields: [{ k: 'title', l: 'Título' }, { k: 'body', l: 'Texto (estrofes preservadas)', t: 'area' }, { k: 'author', l: 'Autor(a)' }, { k: 'turma', l: 'Turma' }, { k: 'featured', l: 'Destaque', t: 'check' }, { k: 'published', l: 'Publicado', t: 'check' }] },
  settings: { order: 'id', fields: [{ k: 'banner_url', l: 'Banner', t: 'file' }, { k: 'title', l: 'Título do site' }, { k: 'subtitle', l: 'Subtítulo' }, { k: 'intro', l: 'Texto de boas-vindas', t: 'area' }, { k: 'footer', l: 'Rodapé' }] },
};
const NAMES: any = { settings: 'Configurações', images: 'Imagens', videos: 'Vídeos', poems: 'Poesias' };
const inp = 'w-full bg-ebano border border-ocre/30 p-2 rounded';

function Manager({ table }: { table: string }) {
  const { fields, order } = TABS[table];
  const [rows, setRows] = useState<any[]>([]); const [f, setF] = useState<any>({}); const [msg, setMsg] = useState('');
  const load = async () => { const { data } = await supabase.from(table).select('*').order(order, { ascending: order === 'sort_order' || table === 'settings' }); setRows(data || []); if (table === 'settings') setF(data?.[0] || {}); };
  useEffect(() => { setF({}); load(); }, [table]);
  const up = async (k: string, file?: File) => {
    if (!file) return;
    if (file.size > 5242880) return setMsg('Arquivo maior que 5 MB.');
    const p = `${Date.now()}-${file.name.replace(/[^\w.]/g, '_')}`;
    const { error } = await supabase.storage.from('media').upload(p, file);
    if (error) return setMsg('Falha no envio.');
    setF({ ...f, [k]: supabase.storage.from('media').getPublicUrl(p).data.publicUrl });
  };
  const save = async () => {
    const { id, created_at, ...d } = f;
    const r = table === 'settings' ? await supabase.from(table).update(d).eq('id', 1) : id ? await supabase.from(table).update(d).eq('id', id) : await supabase.from(table).insert(d);
    setMsg(r.error ? 'Não foi possível salvar.' : 'Salvo.'); if (!r.error) { if (table !== 'settings') setF({}); load(); }
  };
  const del = async (id: string) => { if (confirm('Excluir este item?')) { await supabase.from(table).delete().eq('id', id); load(); } };
  const toggle = async (r: any) => { await supabase.from(table).update({ published: !r.published }).eq('id', r.id); load(); };
  return (<div className="grid md:grid-cols-2 gap-6">
    <div className="space-y-3">
      {fields.map(x => <label key={x.k} className="block text-sm">{x.l}
        {x.t === 'check' ? <input type="checkbox" className="ml-2" checked={!!f[x.k]} onChange={e => setF({ ...f, [x.k]: e.target.checked })} />
          : x.t === 'file' ? <><input type="file" accept="image/*" className="block" onChange={e => up(x.k, e.target.files?.[0])} />{f[x.k] && <img src={f[x.k]} alt="" className="h-20 mt-1" />}</>
          : x.t === 'area' ? <textarea rows={6} className={inp} value={f[x.k] || ''} onChange={e => setF({ ...f, [x.k]: e.target.value })} />
          : <input className={inp} value={f[x.k] ?? ''} onChange={e => setF({ ...f, [x.k]: e.target.value })} />}</label>)}
      <button onClick={save} className="bg-ambar px-4 py-2 rounded font-bold text-ebano">Salvar</button> <span className="text-sm">{msg}</span>
    </div>
    {table !== 'settings' && <ul className="space-y-2">{rows.map(r => <li key={r.id} className="bg-cafe p-3 rounded flex justify-between gap-2">
      <span>{r.title}{!r.published && <em className="text-ocre"> (oculto)</em>}</span>
      <span className="space-x-2 text-sm shrink-0"><button onClick={() => setF(r)}>Editar</button><button onClick={() => toggle(r)}>{r.published ? 'Ocultar' : 'Publicar'}</button><button onClick={() => del(r.id)}>Excluir</button></span></li>)}</ul>}
  </div>);
}

export default function Admin() {
  const [ok, setOk] = useState<boolean | null>(null); const [tab, setTab] = useState('settings'); const [err, setErr] = useState('');
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setOk(!!data.session)); }, []);
  const login = async (e: any) => { e.preventDefault(); const d = new FormData(e.target);
    const { error } = await supabase.auth.signInWithPassword({ email: String(d.get('e')), password: String(d.get('p')) });
    error ? setErr('Credenciais inválidas ou muitas tentativas. Aguarde e tente de novo.') : setOk(true); };
  if (ok === null) return null;
  if (!ok) return <form onSubmit={login} className="max-w-sm mx-auto mt-32 p-6 card space-y-3">
    <h1 className="font-titulo text-2xl text-ocre">Acesso restrito</h1>
    <input name="e" type="email" required placeholder="E-mail" className={inp} /><input name="p" type="password" required placeholder="Senha" className={inp} />
    <button className="w-full bg-ambar py-2 rounded font-bold text-ebano">Entrar</button><p className="text-sm text-red-400">{err}</p></form>;
  return (<div className="max-w-5xl mx-auto p-6">
    <div className="flex gap-2 mb-6 flex-wrap">{Object.keys(TABS).map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded ${tab === t ? 'bg-ambar text-ebano' : 'bg-cafe'}`}>{NAMES[t]}</button>)}
      <button className="ml-auto" onClick={async () => { await supabase.auth.signOut(); setOk(false); }}>Sair</button></div>
    <Manager table={tab} /></div>);
}
