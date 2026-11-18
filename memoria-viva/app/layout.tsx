import './globals.css';
import { Fraunces, Source_Sans_3 } from 'next/font/google';
const t = Fraunces({ subsets: ['latin'], variable: '--f-titulo', weight: ['700', '900'] });
const x = Source_Sans_3({ subsets: ['latin'], variable: '--f-texto' });
export const metadata = { title: 'Dia da Consciência Negra' };
export default function L({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body className={`${t.variable} ${x.variable} font-texto`}>{children}</body></html>;
}
