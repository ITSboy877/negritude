import { supabase, toEmbed } from '@/lib/supabase';
import Gallery from '@/components/Gallery';
export const revalidate = 30;
export default async function Home() {
  const [s, im, vd, po] = await Promise.all([
    supabase.from('settings').select('*').eq('id', 1).single(),
    supabase.from('images').select('*').eq('published', true).order('sort_order'),
    supabase.from('videos').select('*').eq('published', true).order('sort_order'),
    supabase.from('poems').select('*').eq('published', true).order('featured', { ascending: false }).order('created_at', { ascending: false }),
  ]);
  const c = s.data || ({} as any);
  const H = ({ children }: any) => <h2 className="font-titulo font-black text-4xl text-ocre mb-8">{children}</h2>;
  return (<main>
    <header className="adinkra relative min-h-[80vh] flex items-end" style={c.banner_url ? { backgroundImage: `linear-gradient(#0F0D0Ccc,#0F0D0C), url(${encodeURI(c.banner_url)})`, backgroundSize: 'cover' } : {}}>
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h1 className="font-titulo font-black text-5xl md:text-8xl leading-none">{c.title}</h1>
        <p className="mt-4 text-2xl text-ocre font-titulo">{c.subtitle}</p>
        <p className="mt-4 max-w-xl text-lg opacity-80">{c.intro}</p>
      </div>
    </header>
    <div className="kente" />
    <section className="max-w-6xl mx-auto px-6 py-16"><H>Mural fotográfico</H><Gallery items={im.data || []} /></section>
    <div className="kente" />
    <section className="bg-cafe py-16"><div className="max-w-6xl mx-auto px-6"><H>Mostra de vídeos</H>
      <div className="grid md:grid-cols-2 gap-6">{(vd.data || []).map((v: any) => { const e = toEmbed(v.url); return e && (
        <div key={v.id} className="card p-3"><div className="aspect-video"><iframe src={e} title={v.title} allowFullScreen loading="lazy" className="w-full h-full" /></div>
          <p className="mt-2 font-titulo font-bold">{v.title}</p><p className="text-sm opacity-70">{v.category}</p></div>); })}</div></div></section>
    <div className="kente" />
    <section className="max-w-5xl mx-auto px-6 py-16"><H>Antologia de poesias e textos</H>
      <div className="grid md:grid-cols-2 gap-6">{(po.data || []).map((p: any) => (
        <article key={p.id} className={`card p-6 ${p.featured ? 'md:col-span-2 border-ocre' : ''}`}>
          <h3 className="font-titulo text-2xl font-bold text-ocre">{p.title}</h3>
          <p className="mt-4 whitespace-pre-line leading-8 text-lg">{p.body}</p>
          <p className="mt-4 text-sm opacity-70">{p.author}{p.turma && ` · ${p.turma}`}</p></article>))}</div></section>
    <div className="kente" /><footer className="py-8 text-center opacity-70">{c.footer}</footer>
  </main>);
}
