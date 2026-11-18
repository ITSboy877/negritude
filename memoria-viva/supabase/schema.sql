-- Cole no SQL Editor do Supabase e execute.
create table settings(id int primary key default 1 check(id=1), title text, subtitle text, intro text, banner_url text, footer text);
insert into settings values(1,'Dia da Consciência Negra','Nossa escola celebra a memória e a resistência','Trabalhos, apresentações e criações dos nossos alunos.',null,'Projeto escolar · 2026');
create table images(id uuid primary key default gen_random_uuid(), title text, caption text, turma text, url text not null, sort_order int default 0, published bool default true, created_at timestamptz default now());
create table videos(id uuid primary key default gen_random_uuid(), title text, description text, category text, url text not null, sort_order int default 0, published bool default true, created_at timestamptz default now());
create table poems(id uuid primary key default gen_random_uuid(), title text not null, body text not null, author text, turma text, featured bool default false, published bool default true, created_at timestamptz default now());

-- RLS: leitura pública só do que está publicado; escrita só com JWT de usuário autenticado.
do $$ declare t text; begin
 foreach t in array array['settings','images','videos','poems'] loop
  execute format('alter table %I enable row level security',t);
  if t='settings' then execute 'create policy "leitura" on settings for select using(true)';
  else execute format('create policy "leitura" on %I for select using(published or auth.uid() is not null)',t); end if;
  execute format('create policy "inserir" on %I for insert to authenticated with check(true)',t);
  execute format('create policy "editar" on %I for update to authenticated using(true) with check(true)',t);
  execute format('create policy "excluir" on %I for delete to authenticated using(true)',t);
 end loop; end $$;

-- Storage: bucket público para leitura; upload/edição/exclusão só autenticado.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('media','media',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy "midia leitura" on storage.objects for select using(bucket_id='media');
create policy "midia insert" on storage.objects for insert to authenticated with check(bucket_id='media');
create policy "midia update" on storage.objects for update to authenticated using(bucket_id='media');
create policy "midia delete" on storage.objects for delete to authenticated using(bucket_id='media');
