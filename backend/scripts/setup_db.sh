#!/bin/bash
# setup_db.sh

# Stop on error
set -e

# Load env vars or use defaults
DB_HOST=${POSTGRES_HOST:-localhost}
DB_USER=${POSTGRES_USER:-postgres}
DB_NAME=${POSTGRES_DB:-healthcare_dashboard}
DB_PORT=${POSTGRES_PORT:-5432}

echo "Running Database Setup on $DB_HOST:$DB_PORT/$DB_NAME..."

# Check if init.sql exists
if [ ! -f "../db/init.sql" ]; then
    echo "Error: init.sql not found in ../db/"
    exit 1
fi

# Run the initialization script
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -p "$DB_PORT" -f ../db/init.sql

echo "Database Setup Complete."
