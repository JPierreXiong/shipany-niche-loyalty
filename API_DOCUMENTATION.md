# Niche Loyalty - Complete API Documentation

## 📋 API Overview

All APIs require authentication unless specified otherwise. Authentication is handled via session cookies.

Base URL: `https://your-domain.com/api`

---

## 🎯 Dashboard APIs

### 1. Get Dashboard Stats
**Endpoint**: `GET /api/niche-loyalty/dashboard/stats`

**Description**: Get overview statistics for the dashboard

**Response**:
```json
{
  "code": 0,
  "data": {
    "totalMembers": 150,
    "activeCards": 5,
    "redemptionRate": 23.5,
    "totalRevenue": 450000
  }
}
```

### 2. Get Recent Activity
**Endpoint**: `GET /api/niche-loyalty/dashboard/activity`

**Description**: Get recent activity logs

**Response**:
```json
{
  "code": 0,
  "data": [
    {
      "id": "uuid",
      "type": "card_sent",
      "message": "Welcome 20% OFF sent to john@example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 💳 Discount Cards APIs

### 3. List Cards
**Endpoint**: `GET /api/niche-loyalty/cards/list`

**Description**: Get all discount cards for the current store

**Response**:
```json
{
  "code": 0,
  "data": [
    {
      "id": "uuid",
      "name": "Welcome 20% OFF",
      "discountType": "percentage",
      "discountValue": 20,
      "expireDays": 30,
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 4. Create Card
**Endpoint**: `POST /api/niche-loyalty/cards/create`

**Description**: Create a new discount card

**Request Body**:
```json
{
  "name": "Welcome 20% OFF",
  "discountType": "percentage",
  "discountValue": 20,
  "expireDays": 30
}
```

**Response**:
```json
{
  "code": 0,
  "data": {
    "id": "uuid",
    "name": "Welcome 20% OFF",
    "discountType": "percentage",
    "discountValue": 20,
    "expireDays": 30,
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 5. Delete Card
**Endpoint**: `POST /api/niche-loyalty/cards/delete`

**Description**: Delete a discount card

**Request Body**:
```json
{
  "id": "uuid"
}
```

**Response**:
```json
{
  "code": 0,
  "message": "Card deleted successfully"
}
```

---

## ⚡ Automation APIs

### 6. List Automations
**Endpoint**: `GET /api/niche-loyalty/automations/list`

**Description**: Get all automation rules

**Response**:
```json
{
  "code": 0,
  "data": [
    {
      "id": "uuid",
      "cardName": "Welcome 20% OFF",
      "triggerType": "order_paid",
      "triggerValue": 10000,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 7. Create Automation
**Endpoint**: `POST /api/niche-loyalty/automations/create`

**Description**: Create a new automation rule

**Request Body**:
```json
{
  "cardId": "uuid",
  "triggerType": "order_paid",
  "triggerValue": 10000
}
```

**Trigger Types**:
- `order_paid` - When customer completes an order
- `customer_created` - When new customer signs up
- `manual` - Manual send only

**Response**:
```json
{
  "code": 0,
  "data": {
    "id": "uuid",
    "cardId": "uuid",
    "triggerType": "order_paid",
    "triggerValue": 10000,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 8. Toggle Automation
**Endpoint**: `POST /api/niche-loyalty/automations/toggle`

**Description**: Activate or pause an automation

**Request Body**:
```json
{
  "id": "uuid",
  "isActive": true
}
```

**Response**:
```json
{
  "code": 0,
  "message": "Automation updated successfully"
}
```

---

## 👥 Customer Management APIs

### 9. List Customers
**Endpoint**: `GET /api/niche-loyalty/members/list`

**Description**: Get all loyalty program members

**Response**:
```json
{
  "code": 0,
  "data": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "source": "manual",
      "status": "active",
      "joinedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 10. Add Customer
**Endpoint**: `POST /api/niche-loyalty/members/add`

**Description**: Add a single customer manually

**Request Body**:
```json
{
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "code": 0,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "source": "manual",
    "status": "active",
    "joinedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 11. Import CSV
**Endpoint**: `POST /api/niche-loyalty/members/import-csv`

**Description**: Bulk import customers from CSV

**Request Body**:
```json
{
  "csvData": "email,name\njohn@example.com,John Doe\njane@example.com,Jane Smith"
}
```

**Response**:
```json
{
  "code": 0,
  "data": {
    "imported": 2,
    "skipped": 0,
    "errors": []
  }
}
```

### 12. Sync from Shopify
**Endpoint**: `POST /api/niche-loyalty/members/sync`

**Description**: Sync customers from Shopify store

**Response**:
```json
{
  "code": 0,
  "data": {
    "synced": 150,
    "total": 200,
    "message": "Successfully synced 150 new customers from Shopify"
  }
}
```

---

## 🛍️ Shopify Integration APIs

### 13. Initiate Shopify OAuth
**Endpoint**: `POST /api/niche-loyalty/shopify/auth`

**Description**: Start Shopify OAuth flow

**Request Body**:
```json
{
  "shopDomain": "my-store"
}
```

**Response**:
```json
{
  "code": 0,
  "data": {
    "authUrl": "https://my-store.myshopify.com/admin/oauth/authorize?...",
    "shopDomain": "my-store.myshopify.com"
  }
}
```

### 14. Shopify OAuth Callback
**Endpoint**: `GET /api/niche-loyalty/shopify/callback`

**Description**: Handle Shopify OAuth callback (automatic redirect)

**Query Parameters**:
- `code` - Authorization code from Shopify
- `shop` - Shop domain
- `state` - CSRF protection state
- `hmac` - HMAC signature

**Response**: Redirects to dashboard

---

## 🪝 Shopify Webhook Handlers

### 15. Customer Created Webhook
**Endpoint**: `POST /api/webhooks/shopify/customers-create`

**Description**: Handle new customer creation from Shopify

**Headers**:
- `X-Shopify-Hmac-Sha256` - HMAC signature
- `X-Shopify-Shop-Domain` - Shop domain

**Request Body**: Shopify customer object

**Response**:
```json
{
  "code": 0,
  "message": "Customer added to loyalty program"
}
```

### 16. Order Paid Webhook
**Endpoint**: `POST /api/webhooks/shopify/orders-paid`

**Description**: Handle order payment completion

**Headers**:
- `X-Shopify-Hmac-Sha256` - HMAC signature
- `X-Shopify-Shop-Domain` - Shop domain

**Request Body**: Shopify order object

**Response**:
```json
{
  "code": 0,
  "message": "Order processed for loyalty program"
}
```

### 17. Order Updated Webhook
**Endpoint**: `POST /api/webhooks/shopify/orders-updated`

**Description**: Track discount code redemption

**Headers**:
- `X-Shopify-Hmac-Sha256` - HMAC signature
- `X-Shopify-Shop-Domain` - Shop domain

**Request Body**: Shopify order object

**Response**:
```json
{
  "code": 0,
  "message": "Discount codes tracked"
}
```

---

## 📧 Campaign APIs

### 18. Send Campaign
**Endpoint**: `POST /api/niche-loyalty/send-campaign`

**Description**: Send discount cards to selected customers

**Request Body**:
```json
{
  "cardId": "uuid",
  "customerIds": ["uuid1", "uuid2"]
}
```

**Response**:
```json
{
  "code": 0,
  "data": {
    "sent": 2,
    "failed": 0
  }
}
```

### 19. List Campaigns
**Endpoint**: `GET /api/niche-loyalty/campaigns/list`

**Description**: Get all campaigns

**Response**:
```json
{
  "code": 0,
  "data": [
    {
      "id": "uuid",
      "name": "Welcome Campaign",
      "cardId": "uuid",
      "status": "completed",
      "sentCount": 150,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 20. Campaign Stats
**Endpoint**: `GET /api/niche-loyalty/campaigns/stats`

**Description**: Get campaign statistics

**Query Parameters**:
- `campaignId` - Campaign ID

**Response**:
```json
{
  "code": 0,
  "data": {
    "sent": 150,
    "delivered": 148,
    "opened": 120,
    "redeemed": 35
  }
}
```

---

## ⚙️ Settings APIs

### 21. Get Store Config
**Endpoint**: `GET /api/niche-loyalty/store/get`

**Description**: Get store configuration

**Response**:
```json
{
  "code": 0,
  "data": {
    "id": "uuid",
    "name": "My Store",
    "shopifyDomain": "my-store.myshopify.com",
    "status": "active",
    "brandConfig": {
      "logoUrl": "https://...",
      "primaryColor": "#000000",
      "senderName": "My Brand",
      "senderEmail": "hello@mybrand.com"
    }
  }
}
```

### 22. Update Brand Config
**Endpoint**: `POST /api/niche-loyalty/brand/update`

**Description**: Update brand configuration

**Request Body**:
```json
{
  "brandName": "My Brand",
  "primaryColor": "#000000",
  "logoUrl": "https://...",
  "senderName": "My Brand",
  "senderEmail": "hello@mybrand.com"
}
```

**Response**:
```json
{
  "code": 0,
  "message": "Brand settings updated successfully"
}
```

---

## 📤 Storage APIs

### 23. Upload Image
**Endpoint**: `POST /api/storage/upload-image`

**Description**: Upload brand logo or images

**Request**: `multipart/form-data`
- `file` - Image file (JPEG, PNG, GIF, WebP)

**Response**:
```json
{
  "code": 0,
  "data": {
    "url": "https://blob.vercel-storage.com/...",
    "pathname": "logo-abc123.png",
    "contentType": "image/png",
    "size": 12345
  }
}
```

---

## 🔐 Authentication

All APIs use session-based authentication. Users must be logged in to access these endpoints.

**Error Response Format**:
```json
{
  "code": 1,
  "message": "Error message here"
}
```

**Common Error Codes**:
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (no permission)
- `404` - Not found
- `400` - Bad request (invalid parameters)
- `500` - Internal server error

---

## 📊 Data Models

### Discount Card
```typescript
{
  id: string;
  storeId: string;
  name: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  expireDays: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Automation
```typescript
{
  id: string;
  storeId: string;
  cardId: string;
  triggerType: 'order_paid' | 'customer_created' | 'manual';
  triggerValue: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer
```typescript
{
  id: string;
  storeId: string;
  email: string;
  name: string | null;
  source: 'manual' | 'csv_import' | 'shopify_sync';
  status: 'active' | 'inactive';
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Discount Code
```typescript
{
  id: string;
  cardId: string;
  customerId: string;
  code: string;
  isRedeemed: boolean;
  orderId: string | null;
  orderName: string | null;
  redeemedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Rate Limits

- **Dashboard APIs**: 100 requests/minute
- **Webhook APIs**: No limit (verified by HMAC)
- **Campaign APIs**: 10 requests/minute
- **Upload APIs**: 20 requests/minute

---

## 🔧 Environment Variables Required

```bash
# Shopify Integration
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret

# Database
DATABASE_URL=postgresql://...

# Email (Resend)
RESEND_API_KEY=your_resend_key

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=your_blob_token

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 📝 Notes

1. All monetary values are stored in cents (e.g., $100.00 = 10000)
2. All dates are in ISO 8601 format
3. Webhook signatures must be verified using HMAC-SHA256
4. Customer data is privacy-protected (no order details stored)
5. Discount codes are unique and single-use by default

---

## 🆘 Support

For API support, please contact: support@glownicheloyalty.com

Last Updated: 2024-01-15




