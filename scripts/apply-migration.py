#!/usr/bin/env python3
"""
Apply database migration manually
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')


def init_supabase() -> Client:
    """Initialize Supabase client"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Missing Supabase credentials in .env file")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def apply_migration(supabase: Client):
    """Apply the uses column migration"""
    print("📦 Applying migration: Add 'uses' column to prompts table")

    # Read the migration SQL
    with open('supabase/migrations/002_add_uses_column.sql', 'r') as f:
        sql = f.read()

    # Execute SQL via RPC (if available) or direct SQL execution
    try:
        # Try to execute SQL via the SQL editor API
        # Note: This requires appropriate permissions
        result = supabase.rpc('exec', {'query': sql}).execute()
        print("✅ Migration applied successfully!")
    except Exception as e:
        print(f"❌ Error applying migration: {e}")
        print("\nPlease apply the migration manually by running this SQL in Supabase SQL Editor:")
        print("="*60)
        print(sql)
        print("="*60)


def main():
    print("\n" + "="*60)
    print("SUPABASE MIGRATION TOOL")
    print("="*60 + "\n")

    try:
        supabase = init_supabase()
        print("✅ Connected to Supabase\n")
        apply_migration(supabase)
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
