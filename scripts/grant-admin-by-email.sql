-- Grant admin role to an existing signed-up user by email (idempotent)
-- Usage:
-- 1) Set target_email
-- 2) Run in Supabase SQL Editor as role: postgres

DO $$
DECLARE
  target_email text := 'admin@atls.com';
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE lower(trim(email)) = lower(trim(target_email))
  ORDER BY created_at DESC
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found for email: %. Sign up first, then rerun.', target_email;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Admin is ready. user_id=%, email=%', target_user_id, target_email;
END $$;
