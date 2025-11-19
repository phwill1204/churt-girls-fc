# Resend Setup Instructions

## Quick Setup (5 minutes)

### 1. Create Resend Account
I've opened the signup page for you. Complete the registration:
- Enter your email (philipjohnwilliams@gmail.com)
- Verify your email
- **100% FREE - 3,000 emails/month, no expiration**

### 2. Get Your API Key
Once logged in:
1. Click **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Name: `ChurtGirlsFC`
4. Permission: **Sending access**
5. Click **Create**
6. **COPY THE API KEY** (starts with `re_...`)

### 3. Add API Key to Azure
Run this command (replace YOUR_API_KEY with the actual key):

```powershell
az staticwebapp appsettings set `
  --name churt-girls-fc `
  --resource-group Football `
  --setting-names RESEND_API_KEY="YOUR_API_KEY_HERE"
```

### 4. Add Your Domain (Optional - For Custom Sender)
By default, emails will come from `onboarding@resend.dev`

To use your own domain:
1. In Resend dashboard, go to **Domains**
2. Add domain (requires DNS setup)
3. Update `api/send-order/index.js` line 22:
   ```javascript
   from: 'Churt Girls FC <orders@yourdomain.com>',
   ```

### 5. Deploy Changes
```powershell
cd C:\Users\phwill\churt-fc-website
git add .
git commit -m "Switch to Resend for email"
git push
```

### 6. Test!
Once deployed, test at: https://lemon-meadow-040962003.3.azurestaticapps.net

## Why Resend?

✅ **Free Forever** - 3,000 emails/month, no trial expiration
✅ **Modern API** - Simple REST API, no SMTP configuration
✅ **Fast** - Built for developers
✅ **Reliable** - High deliverability rates
✅ **Easy Setup** - No domain verification required to start

## Current Status

✅ Azure Function updated to use Resend API
✅ Removed nodemailer dependency
✅ Code ready to commit
⏳ Waiting for Resend API key
⏳ Need to configure API key in Azure
⏳ Deploy and test

## Troubleshooting

### Error: "Invalid API key"
- Check that RESEND_API_KEY is set correctly in Azure
- Verify the key starts with `re_`

### Emails going to spam
- Use default `onboarding@resend.dev` sender (best deliverability)
- Or add and verify your own domain

### Need to change recipient email
Update `api/send-order/index.js` line 23:
```javascript
to: ['your-new-email@example.com'],
```
