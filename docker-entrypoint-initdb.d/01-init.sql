-- Initialize the database with base structure
-- The actual schema will be managed by Prisma migrations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Setup ownership and permissions
ALTER DATABASE udc_website OWNER TO postgres;
GRANT ALL PRIVILEGES ON DATABASE udc_website TO postgres;