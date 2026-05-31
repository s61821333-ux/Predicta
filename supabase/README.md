# Supabase setup

Run these SQL files **in order** in the Supabase Dashboard → SQL Editor:

1. `migrations/001_users.sql` — users table + auth trigger
2. `migrations/002_schema.sql` — settings, categories, transactions, budgets, chat + RLS + seed categories
3. `migrations/004_avatars_storage.sql` — public `avatars` bucket + Storage policies (for profile photos)

Ensure `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

After signup, each user gets rows in `users` and `user_settings`. Add transactions via **עסקה חדשה** to populate the dashboard and reports.

Optional: insert monthly budgets in the `budgets` table for budget tracking on the dashboard.
