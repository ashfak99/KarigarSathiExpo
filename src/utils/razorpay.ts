import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';

/* ============================================================
   Backend URL (from .env)
============================================================ */
const API_URL = process.env.EXPO_PUBLIC_API_URL as string;

if (!API_URL) {
  console.warn('⚠️ EXPO_PUBLIC_API_URL not set in .env file');
}

const pendingKey = (resumeId: string) => `pending_order:${resumeId}`;

/* ============================================================
   Types
============================================================ */
export type PayResult =
  | { status: 'paid' }
  | { status: 'cancelled' }
  | { status: 'pending' }
  | { status: 'error'; message: string };

/* ============================================================
   API Helper
============================================================ */
async function api<T = any>(
  path: string,
  body: object,
  timeoutMs = 60000 // Render cold start ke liye
): Promise<{ status: number; data: T }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data: data as T };
  } finally {
    clearTimeout(timer);
  }
}

/* ============================================================
   Warm Up Server (cold start ke liye)
============================================================ */
export function warmUpServer() {
  if (!API_URL) return;
  fetch(`${API_URL}/health`).catch(() => {
    // Silent fail
  });
}

/* ============================================================
   Check Pending Payment
============================================================ */
async function checkPending(resumeId: string): Promise<boolean | null> {
  const orderId = await AsyncStorage.getItem(pendingKey(resumeId));
  if (!orderId) return false;

  try {
    const r = await api<{ paid?: boolean }>(
      '/order-status',
      { orderId, resumeId },
      30000
    );

    if (r.status === 200) {
      if (r.data.paid) {
        await AsyncStorage.removeItem(pendingKey(resumeId));
      }
      return !!r.data.paid;
    }
    return null;
  } catch {
    return null;
  }
}

/* ============================================================
   Recover Pending Payment
============================================================ */
export async function recoverPendingPayment(
  resumeId: string
): Promise<boolean> {
  return (await checkPending(resumeId)) === true;
}

/* ============================================================
   Main Payment Flow
============================================================ */
export async function payForResume(resumeId: string): Promise<PayResult> {
  if (!API_URL) {
    return {
      status: 'error',
      message: 'Server URL not configured. Please contact support.',
    };
  }

  /* ===== Step 1: Create Order ===== */
  let order: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };

  try {
    const r = await api<{
      success: boolean;
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
    }>('/create-order', { resumeId });

    if (r.status !== 200 || !r.data?.success) {
      return {
        status: 'error',
        message: 'Could not start payment. Please try again.',
      };
    }

    order = {
      orderId: r.data.orderId,
      amount: r.data.amount,
      currency: r.data.currency,
      keyId: r.data.keyId,
    };
  } catch {
    return {
      status: 'error',
      message: 'Server is busy or no internet. Try again in a minute.',
    };
  }

  // Save order for recovery
  await AsyncStorage.setItem(pendingKey(resumeId), order.orderId);

  /* ===== Step 2: Razorpay Checkout ===== */
  let result: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };

  try {
    result = await RazorpayCheckout.open({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: 'Karigar Sathi',
      description: 'Resume PDF',
      theme: { color: '#1E88E5' },
    });
  } catch (err) {
    // User cancelled or failed — check if money was deducted anyway
    const paid = await checkPending(resumeId);
    return paid ? { status: 'paid' } : { status: 'cancelled' };
  }

  /* ===== Step 3: Verify Payment ===== */
  try {
    const v = await api<{ paid?: boolean }>('/verify-payment', {
      ...result,
      resumeId,
    });

    if (v.status === 200 && v.data?.paid) {
      await AsyncStorage.removeItem(pendingKey(resumeId));
      return { status: 'paid' };
    }

    if (v.status === 400) {
      return {
        status: 'error',
        message: 'Payment could not be verified. Contact support.',
      };
    }

    return { status: 'pending' };
  } catch {
    return { status: 'pending' };
  }
}