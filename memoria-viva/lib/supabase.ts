import { createClient } from '@supabase/supabase-js';
// Chave anon é pública por design; quem protege os dados é o RLS.
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
// Só aceita YouTube/Vimeo: qualquer outra URL é descartada (evita iframes maliciosos).
export function toEmbed(u: string) {
  const y = u.match(/^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (y) return `https://www.youtube-nocookie.com/embed/${y[1]}`;
  const v = u.match(/^https:\/\/(?:www\.)?vimeo\.com\/(\d+)/);
  return v ? `https://player.vimeo.com/video/${v[1]}` : null;
}
