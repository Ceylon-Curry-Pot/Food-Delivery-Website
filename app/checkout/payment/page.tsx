import { redirect } from 'next/navigation';

// This page is not used — payment is handled directly in /checkout
export default function PaymentPage() {
  redirect('/checkout');
}