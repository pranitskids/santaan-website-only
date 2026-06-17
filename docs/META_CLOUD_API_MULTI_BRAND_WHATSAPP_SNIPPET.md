# Meta Cloud API Multi-Brand WhatsApp Snippet

Last checked: 2026-06-17

Purpose: keep a safe reference for using one verified Meta Business Portfolio to run separate WhatsApp senders for Santaan, SKIDS Clinic, and Greybrain later.

## Core Decision

One verified Meta Business Portfolio can manage multiple WhatsApp Business Accounts or multiple phone numbers. For clean patient/customer trust, each brand should use its own WhatsApp sender:

- Santaan: its own WhatsApp phone number, display name, WABA/phone number ID.
- SKIDS Clinic: its own WhatsApp phone number, display name, WABA/phone number ID.
- Greybrain: its own WhatsApp phone number, display name, WABA/phone number ID.

Do not send SKIDS or Greybrain traffic from the Santaan sender if customers should see the correct brand name.

## Values To Save Per Brand

```env
BRAND_NAME=SKIDS Clinic
META_BUSINESS_ID=<business-portfolio-id>
WHATSAPP_WABA_ID=<brand-waba-id>
WHATSAPP_PHONE_NUMBER_ID=<brand-phone-number-id>
WHATSAPP_DISPLAY_PHONE_NUMBER=<brand-whatsapp-number>
WHATSAPP_DISPLAY_NAME=<approved-brand-display-name>
WHATSAPP_ACCESS_TOKEN=<system-user-token-stored-only-in-secrets>
WHATSAPP_WEBHOOK_VERIFY_TOKEN=<random-webhook-verify-token>
WHATSAPP_APP_SECRET=<meta-app-secret-stored-only-in-secrets>
```

Repeat the same block for Greybrain with Greybrain values.

## Useful API Endpoints

List phone numbers under a WABA:

```http
GET https://graph.facebook.com/vXX.X/{WABA_ID}/phone_numbers
Authorization: Bearer {ACCESS_TOKEN}
```

Send a template message:

```http
POST https://graph.facebook.com/vXX.X/{PHONE_NUMBER_ID}/messages
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json

{
  "messaging_product": "whatsapp",
  "to": "91XXXXXXXXXX",
  "type": "template",
  "template": {
    "name": "hello_world",
    "language": {
      "code": "en_US"
    }
  }
}
```

Subscribe app to WABA webhooks:

```http
POST https://graph.facebook.com/vXX.X/{WABA_ID}/subscribed_apps
Authorization: Bearer {ACCESS_TOKEN}
```

Register a phone number after ownership verification:

```http
POST https://graph.facebook.com/vXX.X/{PHONE_NUMBER_ID}/register
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json

{
  "messaging_product": "whatsapp",
  "pin": "6-digit-pin"
}
```

## Permissions Needed

Use a Meta system user token, not a personal browser token, with:

- `whatsapp_business_management`
- `whatsapp_business_messaging`

Some setup/admin operations may also need business management access.

## Guardrails

- Use one sender identity per brand.
- Keep access tokens only in provider secrets, never in Git.
- Keep template names brand-specific where possible.
- Verify display name approval before production traffic.
- Confirm whether an existing "WhatsApp Business app" number is Cloud API-ready before assuming it has a usable `PHONE_NUMBER_ID`.
- Do not migrate/attach an existing app number unless the owner understands the app/API tradeoff.

## Official References

- WhatsApp Cloud API get started: https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started
- Business phone numbers: https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers
- Display names: https://developers.facebook.com/documentation/business-messaging/whatsapp/display-names/
- WhatsApp Business Platform overview: https://developers.facebook.com/documentation/business-messaging/whatsapp/overview
- Meta Postman Cloud API collection: https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api
