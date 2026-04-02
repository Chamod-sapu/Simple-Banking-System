-- ============================================
-- TRANSACTION DATABASE SCHEMA
-- Run this script before starting transaction-service
-- ============================================

CREATE DATABASE IF NOT EXISTS transaction_db;
USE transaction_db;

CREATE TABLE IF NOT EXISTS transactions (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_account_id  BIGINT         NULL,      -- NULL for DEPOSIT
    to_account_id    BIGINT         NULL,      -- NULL for WITHDRAW
    transaction_type ENUM('TRANSFER', 'DEPOSIT', 'WITHDRAW') NOT NULL,
    amount           DECIMAL(15, 2) NOT NULL,
    description      VARCHAR(255)   NULL,
    status           ENUM('SUCCESS', 'FAILED') NOT NULL DEFAULT 'SUCCESS',
    failure_reason   VARCHAR(255)   NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster history queries
CREATE INDEX idx_from_account ON transactions(from_account_id);
CREATE INDEX idx_to_account   ON transactions(to_account_id);
