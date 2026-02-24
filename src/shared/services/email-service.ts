/**
 * Email Service for Niche Loyalty
 * Send Apple Wallet passes via email using Resend
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPassEmailData {
  to: string;
  memberName: string;
  discountCode: string;
  discountValue: number;
  discountType: 'percentage' | 'fixed_amount';
  passUrl: string;
  brandName: string;
  brandColor?: string;
  expiresAt?: Date;
}

/**
 * Send Apple Wallet pass email
 */
export async function sendPassEmail(data: SendPassEmailData): Promise<boolean> {
  try {
    const discountText = data.discountType === 'percentage' 
      ? `${data.discountValue}% OFF` 
      : `$${data.discountValue} OFF`;

    const expiryText = data.expiresAt 
      ? `Valid until ${data.expiresAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` 
      : 'No expiration';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${data.brandName} Loyalty Card</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${data.brandColor || '#000000'} 0%, ${adjustColor(data.brandColor || '#000000', -20)} 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                ${data.brandName}
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                Your Exclusive Reward
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Hi ${data.memberName},
              </p>
              
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for being a valued customer! We've created a special reward just for you.
              </p>

              <!-- Discount Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <div style="font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                      Your Discount
                    </div>
                    <div style="font-size: 48px; font-weight: 700; color: ${data.brandColor || '#000000'}; margin-bottom: 15px;">
                      ${discountText}
                    </div>
                    <div style="font-size: 18px; font-weight: 600; color: #333333; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 12px 20px; border-radius: 6px; display: inline-block; border: 2px dashed ${data.brandColor || '#000000'};">
                      ${data.discountCode}
                    </div>
                    <div style="font-size: 14px; color: #666666; margin-top: 15px;">
                      ${expiryText}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${data.passUrl}" style="display: inline-block; background-color: ${data.brandColor || '#000000'}; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                      Add to Apple Wallet
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                <strong>How to use:</strong>
              </p>
              <ol style="margin: 0 0 20px 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                <li>Tap the button above to add the card to your Apple Wallet</li>
                <li>Show the discount code at checkout</li>
                <li>Enjoy your exclusive discount!</li>
              </ol>

              <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                Can't see the button? Copy and paste this link: <a href="${data.passUrl}" style="color: ${data.brandColor || '#000000'};">${data.passUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px;">
                ${data.brandName} • Powered by Glow
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                You received this email because you're a valued customer.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Glow <noreply@glow.com>',
      to: data.to,
      subject: `Your ${discountText} reward from ${data.brandName}`,
      html: emailHtml,
    });

    console.log(`[Email Service] Sent pass email to ${data.to}:`, result);
    return true;
  } catch (error) {
    console.error('[Email Service] Failed to send email:', error);
    return false;
  }
}

/**
 * Batch send emails
 */
export async function batchSendPassEmails(
  emails: SendPassEmailData[],
  onProgress?: (completed: number, total: number) => void
): Promise<{ success: number; failed: number }> {
  const results = { success: 0, failed: 0 };

  for (let i = 0; i < emails.length; i++) {
    const success = await sendPassEmail(emails[i]);
    
    if (success) {
      results.success++;
    } else {
      results.failed++;
    }

    if (onProgress) {
      onProgress(i + 1, emails.length);
    }

    // Add small delay to avoid rate limiting
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Helper function to adjust color brightness
 */
function adjustColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

