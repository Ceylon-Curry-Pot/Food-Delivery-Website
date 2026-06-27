import { resend } from "./resend";

type OrderEmail = {
  customerName: string;
  customerEmail: string;
  trackingId: string;
  orderId: string;
  total: number;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  paymentMethod?: string;
  items?: { name: string; qty: number; price: number }[];
};

export async function sendOrderConfirmation({
  customerName,
  customerEmail,
  trackingId,
  orderId,
  total,
  orderType,
  deliveryAddress,
  paymentMethod,
  items = [],
}: OrderEmail) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const trackingUrl = `${baseUrl}/tracker/${orderId}`;

  const paymentLabel: Record<string, string> = {
    cod:    'Cash on Delivery',
    card:   'Credit / Debit Card (PayHere)',
    wallet: 'Digital Wallet (PayHere)',
  };

  const itemsHtml = items.length > 0
    ? items.map((item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">
            ${item.name}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#9ca3af;text-align:center;">
            × ${item.qty}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;font-weight:700;color:#111827;text-align:right;">
            Rs. ${(item.price * item.qty).toLocaleString()}
          </td>
        </tr>
      `).join('')
    : '';

  return resend.emails.send({
    from: "Ceylon Curry Pot <onboarding@resend.dev>",
    to: customerEmail,
    subject: `Order Confirmed – ${trackingId} | Ceylon Curry Pot 🍛`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626 0%,#ea580c 100%);border-radius:20px 20px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;">
                Authentic Sri Lankan Cuisine
              </p>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                Ceylon Curry Pot
              </h1>
              <div style="width:40px;height:2px;background:rgba(255,255,255,0.35);margin:14px auto 0;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Success message -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px 24px;text-align:center;">
              <div style="width:68px;height:68px;background:#f0fdf4;border-radius:50%;margin:0 auto 18px;font-size:34px;line-height:68px;">
                ✅
              </div>
              <h2 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#111827;">
                Your order is confirmed! 🎉
              </h2>
              <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.65;">
                Hi <strong style="color:#111827;">${customerName}</strong>, your authentic Sri Lankan meal
                is being prepared right now.
              </p>
            </td>
          </tr>

          <!-- Tracker code box -->
          <tr>
            <td style="background:#ffffff;padding:0 40px 28px;">
              <div style="background:#fef2f2;border:2px dashed #fca5a5;border-radius:16px;padding:28px 24px;text-align:center;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:3px;">
                  Your Tracker Code
                </p>
                <p style="margin:0 0 6px;font-size:30px;font-weight:800;color:#dc2626;font-family:monospace;letter-spacing:2px;">
                  ${trackingId}
                </p>
                <p style="margin:0 0 20px;font-size:12px;color:#6b7280;line-height:1.6;">
                  Save this code. Use it anytime at
                  <a href="${baseUrl}/tracker" style="color:#dc2626;text-decoration:none;font-weight:600;">
                    ceyloncurrypot.lk/tracker
                  </a>
                  to look up your order.
                </p>
                <a href="${trackingUrl}"
                   style="display:inline-block;background:#dc2626;color:#ffffff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:100px;text-decoration:none;letter-spacing:0.5px;">
                  Track My Order →
                </a>
              </div>
            </td>
          </tr>

          <!-- Order items -->
          ${items.length > 0 ? `
          <tr>
            <td style="background:#ffffff;padding:0 40px 24px;">
              <h3 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:1px;">
                Items Ordered
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
                <tr>
                  <td colspan="2" style="padding:14px 0 0;font-size:15px;font-weight:700;color:#111827;border-top:2px solid #111827;">
                    Total
                  </td>
                  <td style="padding:14px 0 0;font-size:15px;font-weight:800;color:#dc2626;border-top:2px solid #111827;text-align:right;">
                    Rs. ${total.toLocaleString()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : `
          <tr>
            <td style="background:#ffffff;padding:0 40px 24px;">
              <p style="margin:0;font-size:15px;color:#374151;">
                Order Total: <strong style="color:#dc2626;">Rs. ${total.toLocaleString()}</strong>
              </p>
            </td>
          </tr>`}

          <!-- Order details -->
          <tr>
            <td style="background:#ffffff;padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f9fafb;border-radius:14px;padding:20px;border:1px solid #f3f4f6;">
                <tr>
                  <td>
                    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;">
                      Order Details
                    </p>
                    <p style="margin:0 0 8px;font-size:13px;color:#374151;">
                      <strong>Type:</strong>
                      ${orderType === 'delivery' ? '🛵 Delivery' : '🏠 Pickup'}
                    </p>
                    ${orderType === 'delivery' && deliveryAddress ? `
                    <p style="margin:0 0 8px;font-size:13px;color:#374151;">
                      <strong>Address:</strong> ${deliveryAddress}
                    </p>` : ''}
                    <p style="margin:0;font-size:13px;color:#374151;">
                      <strong>Payment:</strong>
                      ${paymentLabel[paymentMethod ?? 'cod'] ?? paymentMethod ?? 'Cash on Delivery'}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Estimated time banner -->
          <tr>
            <td style="background:#ffffff;padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#fffbeb;border-radius:14px;padding:16px 20px;border:1px solid #fde68a;">
                <tr>
                  <td style="font-size:13px;color:#92400e;line-height:1.6;">
                    ⏱ <strong>Estimated time:</strong>
                    ${orderType === 'delivery'
                      ? 'Your order should arrive in approximately <strong>35–45 minutes</strong>.'
                      : 'Your order will be ready for pickup in approximately <strong>25–30 minutes</strong>.'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111827;border-radius:0 0 20px 20px;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#9ca3af;">
                Questions? Call
                <a href="tel:0778282112" style="color:#f87171;text-decoration:none;font-weight:600;">
                  077 828 2112
                </a>
                or email
                <a href="mailto:ceyloncurrypot.lk@gmail.com" style="color:#f87171;text-decoration:none;font-weight:600;">
                  ceyloncurrypot.lk@gmail.com
                </a>
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#4b5563;">
                © 2024 Ceylon Curry Pot · Liberty Plaza I Food Court, Colombo
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
}