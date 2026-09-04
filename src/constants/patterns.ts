/**
 * Centralized Regular Expression Patterns for AgriSync
 * Ensures industry-grade validation consistency across all forms and services.
 */
export const PATTERNS = {
  // Indonesian mobile phone format: starts with 08, 628, or +628, followed by valid operator digit and 7-10 digits (10-13 total digits)
  PHONE_ID: /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/,

  // Full name: strictly letters (including unicode accents) and name punctuation (. , ' -). Zero digits allowed. Minimum 2 alphabetic characters.
  FULL_NAME: /^(?=.*[\p{L}]{2,})[\p{L}\s\-'.,]+$/u,

  // Company / Estate name: alphanumeric characters, spaces, and standard corporate symbols (& . , - ' / ()). Minimum 2 alphanumeric chars.
  COMPANY_NAME: /^(?=.*[a-zA-Z0-9]{2,})[a-zA-Z0-9\s&.,\-'/()]+$/u,

  // Alphanumeric Workspace / Company Code (4-10 characters)
  WORKSPACE_CODE: /^[A-Za-z0-9_-]{4,10}$/,

  // Standard valid domain pattern (supports corporate and enterprise domains)
  VALID_DOMAIN: /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,

  // Strict RFC 5322 email regex: disallows consecutive/leading/trailing dots, enforces valid domain with 2+ char TLD
  STRICT_EMAIL: /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/,
} as const;
