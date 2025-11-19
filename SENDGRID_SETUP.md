# SendGrid Setup Instructions

## Steps to Configure Automated Email:

### 1. Create a SendGrid Account
1. Go to https://sendgrid.com/
2. Sign up for a **FREE account** (100 emails/day)
3. Verify your email address

### 2. Create an API Key
1. Log into SendGrid
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it: `ChurtGirlsFC`
5. Select **Full Access** or **Mail Send** permissions
6. Click **Create & View**
7. **COPY THE API KEY** (you can only see it once!)

### 3. Add API Key to Azure Static Web App
Run this command in PowerShell (replace YOUR_API_KEY_HERE with the actual key):

```powershell
az staticwebapp appsettings set `
  --name churt-girls-fc `
  --resource-group Football `
  --setting-names SENDGRID_API_KEY="YOUR_API_KEY_HERE"
```

### 4. Verify Sender Email (Required by SendGrid)
SendGrid requires you to verify your sender email:

1. In SendGrid, go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Enter your details:
   - From Email: `noreply@churtgirlsfc.com` (or your actual domain email)
   - From Name: `Churt Girls FC`
   - Reply To: `philipjohnwilliams@gmail.com`
4. Click Create
5. Check your email and click the verification link

**Note:** If you don't own `churtgirlsfc.com`, use an email you control (like `philipjohnwilliams@gmail.com`)

### 5. Update the Azure Function (if needed)
If you used a different sender email, update `api/send-order/index.js` line 24:
```javascript
from: 'your-verified-email@domain.com',
```

### 6. Test the Form
Once deployed, test your form at:
https://lemon-meadow-040962003.3.azurestaticapps.net

## Troubleshooting

### Error: "Sender email not verified"
- Make sure you verified your sender email in SendGrid
- Update the `from` field in `api/send-order/index.js` to match

### Error: "401 Unauthorized"
- Check that SENDGRID_API_KEY is set correctly in Azure
- Verify the API key has Mail Send permissions

### Emails not arriving
- Check SendGrid dashboard for send activity
- Check spam folder
- Verify recipient email is correct

## Alternative: Use Gmail SMTP (No SendGrid Account Needed)

If you prefer to use Gmail instead:

1. Enable 2-factor authentication on your Gmail account
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Update `api/send-order/index.js`:

```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'philipjohnwilliams@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
    }
});
```

4. Set the app password in Azure:
```powershell
az staticwebapp appsettings set `
  --name churt-girls-fc `
  --resource-group Football `
  --setting-names GMAIL_APP_PASSWORD="your-app-password-here"
```

## Current Status

✅ Azure Function created
✅ Form updated to use Azure Function
✅ Code deployed to GitHub
⏳ Waiting for GitHub Actions to deploy
⏳ Need to configure SendGrid API key
⏳ Need to verify sender email

## Next Steps

1. Wait for GitHub Actions deployment to complete (check: https://github.com/phwill1204/churt-girls-fc/actions)
2. Set up SendGrid or Gmail
3. Add API key to Azure
4. Test the form!
