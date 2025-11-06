#!/usr/bin/env python3
"""
Run SQL migration directly on Supabase
"""

import os
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')


def run_sql_migration():
    """Run SQL migration using Supabase REST API"""
    print("\n" + "="*60)
    print("APPLYING MIGRATION: Add 'uses' column")
    print("="*60 + "\n")

    # Read migration SQL
    with open('supabase/migrations/002_add_uses_column.sql', 'r') as f:
        sql = f.read()

    print("Migration SQL:")
    print(sql)
    print()

    # Use httpx to execute SQL via PostgREST
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }

    # Execute via direct SQL endpoint (if available)
    # Note: Standard Supabase doesn't expose raw SQL execution via REST API
    # We need to use the Supabase Studio SQL editor or supabase CLI

    print("⚠️  The anon key doesn't have permission to run DDL statements.")
    print("Please run this SQL manually in your Supabase SQL Editor:\n")
    print("1. Go to https://supabase.com/dashboard/project/lehsepmhhirnahdzzjhn/sql/new")
    print("2. Copy and paste this SQL:")
    print()
    print("-" * 60)
    print(sql)
    print("-" * 60)
    print()
    print("3. Click 'Run' to execute the migration")
    print()
    print("After running the migration, re-run the migration script:")
    print("  python scripts/migrate-dream-gpts.py")
    print()


if __name__ == "__main__":
    run_sql_migration()
