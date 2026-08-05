import crypto from 'crypto';

export const PAYHERE_CURRENCY = 'LKR';

export type PayhereMode = 'sandbox' | 'live';

export type PayhereCheckoutCustomer = {
  name: string;
  phone: string;
  email?: string;
};

export type PayhereNotifyPayload = {
  merchant_id: string;
  order_id: string;
  payment_id?: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
  method?: string;
};

export function getPayhereConfig() {
  const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  const mode = (process.env.NEXT_PUBLIC_PAYHERE_MODE || 'sandbox') as PayhereMode;

  if (!merchantId || !merchantSecret) {
    throw new Error('Missing PAYHERE_MERCHANT_ID or PAYHERE_MERCHANT_SECRET');
  }

  return {
    merchantId,
    merchantSecret,
    mode,
    sandbox: mode !== 'live',
  };
}

export function getPublicBaseUrl(req: Request) {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    req.headers.get('origin') ||
    new URL(req.url).origin
  ).replace(/\/$/, '');
}

export function formatPayhereAmount(amount: number) {
  return Number(amount).toFixed(2);
}

export function buildCheckoutHash(
  merchantId: string,
  orderId: string,
  amount: string,
  currency: string,
  merchantSecret: string
) {
  const secretHash = md5(merchantSecret).toUpperCase();
  return md5(`${merchantId}${orderId}${amount}${currency}${secretHash}`).toUpperCase();
}

export function buildNotifyHash(
  merchantId: string,
  orderId: string,
  amount: string,
  currency: string,
  statusCode: string,
  merchantSecret: string
) {
  const secretHash = md5(merchantSecret).toUpperCase();
  return md5(`${merchantId}${orderId}${amount}${currency}${statusCode}${secretHash}`).toUpperCase();
}

export function verifyPayhereNotification(payload: PayhereNotifyPayload) {
  const { merchantId, merchantSecret } = getPayhereConfig();

  if (payload.merchant_id !== merchantId) return false;

  const expected = buildNotifyHash(
    payload.merchant_id,
    payload.order_id,
    payload.payhere_amount,
    payload.payhere_currency,
    payload.status_code,
    merchantSecret
  );

  return expected === payload.md5sig.toUpperCase();
}

export function splitCustomerName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || 'Customer';
  const lastName = parts.join(' ') || firstName;

  return { firstName, lastName };
}

export function mapPayhereStatus(statusCode: string) {
  switch (statusCode) {
    case '2':
      return 'paid';
    case '0':
      return 'pending';
    case '-1':
      return 'cancelled';
    case '-3':
      return 'charged_back';
    default:
      return 'failed';
  }
}

function md5(value: string) {
  return crypto.createHash('md5').update(value).digest('hex');
}
