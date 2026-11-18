# Setup
1. supabase.com > novo projeto. SQL Editor: execute supabase/schema.sql.
2. Authentication > Providers > Email: DESLIGUE "Allow new users to sign up". Mantenha rate limits padrão.
3. Authentication > Users > Add user: crie o único administrador (e-mail + senha forte, "Auto confirm").
4. Settings > API: copie URL e anon key para .env.local (modelo em .env.example). NUNCA use a service_role no front.
5. npm install && npm run dev. Painel: /admin-acesso-restrito. Deploy: Vercel com as mesmas variáveis.
