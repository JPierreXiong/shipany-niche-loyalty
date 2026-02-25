/**
 * Apple Wallet Pass Service
 * Generate .pkpass files for loyalty cards
 */

import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

interface PassData {
  memberId: string;
  memberName: string;
  email: string;
  discountCode: string;
  discountValue: number;
  discountType: 'percentage' | 'fixed_amount';
  brandName: string;
  brandColor: string;
  logoUrl?: string;
  expiresAt?: Date;
}

interface PassGenerationResult {
  passUrl: string;
  discountCode: string;
}

/**
 * Generate a unique discount code
 */
export function generateDiscountCode(prefix: string = 'GLOW'): string {
  const random = nanoid(8).toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * Generate Apple Wallet Pass and upload to Vercel Blob
 * 
 * Note: This is a simplified version for MVP
 * For production, you'll need:
 * 1. Apple Developer account
 * 2. Pass Type ID certificate
 * 3. passkit-generator library
 */
export async function generateAndUploadPass(
  data: PassData
): Promise<PassGenerationResult> {
  try {
    // For MVP: Generate a simple JSON representation
    // In production, this would use passkit-generator to create actual .pkpass files
    const passData = {
      formatVersion: 1,
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || 'pass.com.glow.loyalty',
      serialNumber: data.memberId,
      teamIdentifier: process.env.APPLE_TEAM_ID || 'TEAM123',
      organizationName: data.brandName || 'Glow Loyalty',
      description: `${data.brandName} Loyalty Card`,
      
      // Visual appearance
      backgroundColor: data.brandColor || '#000000',
      foregroundColor: '#FFFFFF',
      labelColor: '#CCCCCC',
      
      // Card content
      generic: {
        primaryFields: [
          {
            key: 'offer',
            label: 'Your Reward',
            value: data.discountType === 'percentage' 
              ? `${data.discountValue}% OFF` 
              : `$${data.discountValue} OFF`,
          },
        ],
        secondaryFields: [
          {
            key: 'code',
            label: 'Discount Code',
            value: data.discountCode,
          },
        ],
        auxiliaryFields: [
          {
            key: 'member',
            label: 'Member',
            value: data.memberName || data.email,
          },
        ],
        backFields: [
          {
            key: 'terms',
            label: 'Terms & Conditions',
            value: 'Present this code at checkout to redeem your discount.',
          },
          {
            key: 'email',
            label: 'Email',
            value: data.email,
          },
        ],
      },
      
      // Barcode (QR code with discount code)
      barcodes: [
        {
          format: 'PKBarcodeFormatQR',
          message: data.discountCode,
          messageEncoding: 'iso-8859-1',
        },
      ],
      
      // Expiration
      ...(data.expiresAt && {
        expirationDate: data.expiresAt.toISOString(),
      }),
    };

    // Convert to JSON string
    const passJson = JSON.stringify(passData, null, 2);
    const passBuffer = Buffer.from(passJson, 'utf-8');

    // Upload to Vercel Blob
    // For MVP, we store JSON. In production, this would be a signed .pkpass file
    const filename = `passes/${data.memberId}-${Date.now()}.json`;
    
    const { url } = await put(filename, passBuffer, {
      access: 'public',
      contentType: 'application/json', // In production: 'application/vnd.apple.pkpass'
    });

    console.log(`[Pass Service] Generated pass for member ${data.memberId}: ${url}`);

    return {
      passUrl: url,
      discountCode: data.discountCode,
    };
  } catch (error) {
    console.error('[Pass Service] Error generating pass:', error);
    throw new Error('Failed to generate Apple Wallet pass');
  }
}

/**
 * Generate pass URL for email template
 * This creates a landing page URL that will trigger wallet download
 */
export function getPassDownloadUrl(passUrl: string, memberId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/niche-loyalty/pass/download?url=${encodeURIComponent(passUrl)}&member=${memberId}`;
}

/**
 * Batch generate passes for multiple members
 * Uses async processing to avoid timeout
 */
export async function batchGeneratePasses(
  members: Array<{
    id: string;
    name: string;
    email: string;
  }>,
  campaignData: {
    discountValue: number;
    discountType: 'percentage' | 'fixed_amount';
    brandName: string;
    brandColor: string;
    logoUrl?: string;
    expiresAt?: Date;
  },
  onProgress?: (completed: number, total: number) => void
): Promise<Array<PassGenerationResult & { memberId: string; email: string }>> {
  const results: Array<PassGenerationResult & { memberId: string; email: string }> = [];
  
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    
    try {
      const discountCode = generateDiscountCode();
      
      const result = await generateAndUploadPass({
        memberId: member.id,
        memberName: member.name,
        email: member.email,
        discountCode,
        ...campaignData,
      });
      
      results.push({
        ...result,
        memberId: member.id,
        email: member.email,
      });
      
      if (onProgress) {
        onProgress(i + 1, members.length);
      }
    } catch (error) {
      console.error(`[Pass Service] Failed to generate pass for ${member.email}:`, error);
      // Continue with other members
    }
  }
  
  return results;
}

/**
 * Update pass (for future use)
 * Apple Wallet supports push updates to passes
 */
export async function updatePass(
  memberId: string,
  updates: Partial<PassData>
): Promise<string> {
  // TODO: Implement pass updates
  // This requires setting up Apple Push Notification service
  throw new Error('Pass updates not yet implemented');
}


