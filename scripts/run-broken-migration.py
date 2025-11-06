#!/usr/bin/env python3
"""
Run SQL migration to add is_broken column
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_sql_migration():
    """Display SQL migration instructions"""
    print("\n" + "="*60)
    print("MIGRATION: Add 'is_broken' column")
    print("="*60 + "\n")

    # Read migration SQL
    with open('supabase/migrations/003_add_is_broken_column.sql', 'r') as f:
        sql = f.read()

    print("Migration SQL:")
    print(sql)
    print()

    print("⚠️  Please run this SQL manually in your Supabase SQL Editor:\n")
    print("1. Go to https://supabase.com/dashboard/project/lehsepmhhirnahdzzjhn/sql/new")
    print("2. Copy and paste this SQL:")
    print()
    print("-" * 60)
    print(sql)
    print("-" * 60)
    print()
    print("3. Click 'Run' to execute the migration")
    print()


if __name__ == "__main__":
    run_sql_migration()
