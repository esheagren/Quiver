# How to Run the Database Migration

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/lehsepmhhirnahdzzjhn
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" - this means the tables were created!

## Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Link your project (if not already linked)
supabase link --project-ref lehsepmhhirnahdzzjhn

# Run the migration
supabase db push
```

## After Running the Migration

Once the migration is complete, you can run the seed script to add sample data:

```bash
bash scripts/seed-prompts.sh
```

Or you can test the app - it should now work without 404 errors!



