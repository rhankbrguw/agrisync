import { z } from 'zod';
import { APP_STRINGS } from '../constants/strings';
import { PATTERNS } from '../constants/patterns';

// Comprehensive typo map for major providers (catching fast typing e.g. .co, .con, etc.)
const TYPO_MAP: Record<string, string> = {
  // Gmail typos
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cpm': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.cmo': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmial.co': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gamil.co': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'gmaul.com': 'gmail.com',
  'gmaip.com': 'gmail.com',
  'googlemail.co': 'googlemail.com',

  // Yahoo typos
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yahoo.cpm': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yaho.co.id': 'yahoo.co.id',
  'yahooo.com': 'yahoo.com',
  'ymail.co': 'ymail.com',

  // Outlook / Hotmail typos
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outlook.cm': 'outlook.com',
  'outlok.com': 'outlook.com',
  'outlok.co': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outook.com': 'outlook.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmail.cm': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'live.co': 'live.com',
  'live.con': 'live.com',

  // iCloud typos
  'icloud.co': 'icloud.com',
  'icloud.con': 'icloud.com',
  'icloud.cm': 'icloud.com',
  'icluod.com': 'icloud.com',
  'iclad.com': 'icloud.com',
};

// Known disposable/temporary spam domains to block
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com',
  'guerrillamail.com', 'sharklasers.com', 'yopmail.com', 'trashmail.com'
]);

function validateEmailDomain(email: string, ctx: z.RefinementCtx) {
  const parts = email.split('@');
  if (parts.length !== 2) return;

  const domain = parts[1].toLowerCase();

  // 1. Catch common typos for major providers with helpful suggestion
  if (TYPO_MAP[domain]) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APP_STRINGS.VALIDATION.EMAIL_TYPO.replace('{0}', TYPO_MAP[domain]),
    });
    return;
  }

  // 2. Block disposable/temporary spam providers
  if (DISPOSABLE_DOMAINS.has(domain)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APP_STRINGS.VALIDATION.EMAIL_PROVIDER_INVALID,
    });
    return;
  }

  // 3. Enforce valid domain structure (labels + TLD)
  if (!PATTERNS.VALID_DOMAIN.test(domain)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APP_STRINGS.VALIDATION.EMAIL_PROVIDER_INVALID,
    });
  }
}

export const emailSchema = z.string()
  .trim()
  .min(1, APP_STRINGS.AUTH.INVALID_CREDENTIALS)
  .regex(PATTERNS.STRICT_EMAIL, APP_STRINGS.VALIDATION.EMAIL_FORMAT)
  .superRefine(validateEmailDomain);

export const phoneSchema = z.string()
  .trim()
  .min(1, APP_STRINGS.VALIDATION.PHONE_REQUIRED)
  .transform(val => val.replace(/[\s\-.]/g, ''))
  .refine(val => PATTERNS.PHONE_ID.test(val), {
    message: APP_STRINGS.VALIDATION.PHONE_FORMAT,
  });

export const nameSchema = z.string()
  .trim()
  .min(3, APP_STRINGS.VALIDATION.FULL_NAME_FORMAT)
  .max(100, APP_STRINGS.VALIDATION.FULL_NAME_MAX)
  .regex(PATTERNS.FULL_NAME, APP_STRINGS.VALIDATION.FULL_NAME_FORMAT);

export const companyNameSchema = z.string()
  .trim()
  .min(2, APP_STRINGS.VALIDATION.COMPANY_FORMAT)
  .max(100, APP_STRINGS.VALIDATION.COMPANY_MAX)
  .regex(PATTERNS.COMPANY_NAME, APP_STRINGS.VALIDATION.COMPANY_FORMAT);

export const workspaceCodeSchema = z.string()
  .trim()
  .toUpperCase()
  .min(4, APP_STRINGS.VALIDATION.COMPANY_CODE_FORMAT)
  .max(10, APP_STRINGS.VALIDATION.COMPANY_CODE_FORMAT)
  .regex(PATTERNS.WORKSPACE_CODE, APP_STRINGS.VALIDATION.COMPANY_CODE_FORMAT);

export const bioSchema = z.string()
  .trim()
  .max(100, APP_STRINGS.VALIDATION.BIO_MAX_LENGTH)
  .nullable();
