-- ============================================
-- ACCOUNT DATABASE SCHEMA
-- Run this script before starting account-service
-- ============================================

CREATE DATABASE IF NOT EXISTS account_db;
USE account_db;

CREATE TABLE IF NOT EXISTS accounts (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(10)    NOT NULL UNIQUE,
    user_id        BIGINT         NOT NULL,
    username       VARCHAR(50)    NOT NULL,
    account_type   ENUM('SAVINGS', 'CURRENT', 'FIXED_DEPOSIT') NOT NULL,
    balance        DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    status         ENUM('ACTIVE', 'INACTIVE', 'FROZEN') NOT NULL DEFAULT 'ACTIVE',
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Note: account_number and balance will be managed by the application
