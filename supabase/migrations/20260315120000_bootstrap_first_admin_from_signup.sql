create or replace function public.bootstrap_first_admin_from_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(9152301);

  if not exists (
    select 1
    from public.user_roles
    where role = 'admin'
  ) then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_bootstrap_first_admin_from_signup on auth.users;

create trigger trg_bootstrap_first_admin_from_signup
after insert on auth.users
for each row
execute function public.bootstrap_first_admin_from_signup();
