# Google OAuth Setup Guide

This guide will help you set up Google OAuth for sign-in functionality in your application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click **"New Project"**
4. Enter a project name (e.g., "Learner Assistance Bot")
5. Click **"Create"**
6. Wait for the project to be created and select it

---

## Step 2: Enable Google+ API (if needed)

1. In the Google Cloud Console, navigate to **"APIs & Services"** → **"Library"**
2. Search for "Google+ API"
3. Click on it and click **"Enable"** (if not already enabled)

---

## Step 3: Configure OAuth Consent Screen

1. Navigate to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** user type (unless you have a Google Workspace)
3. Click **"Create"**

### Fill in the required information:

**App information:**
- App name: `Learner Assistance Bot` (or your app name)
- User support email: Your email address
- App logo: (Optional) Upload your app logo

**App domain:**
- Application home page: `http://localhost:3000` (for development)
- Application privacy policy link: (Optional for development)
- Application terms of service link: (Optional for development)

**Developer contact information:**
- Email addresses: Your email address

4. Click **"Save and Continue"**

### Scopes:
5. Click **"Add or Remove Scopes"**
6. Select the following scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
7. Click **"Update"** and then **"Save and Continue"**

### Test users (for development):
8. Add test users if needed (your email and any other test accounts)
9. Click **"Save and Continue"**
10. Review the summary and click **"Back to Dashboard"**

---

## Step 4: Create OAuth 2.0 Credentials

1. Navigate to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Choose **"Web application"** as the application type

### Configure the OAuth client:

**Name:** `Learner Assistance Bot Web Client` (or any name you prefer)

**Authorized JavaScript origins:**
- `http://localhost:3000` (for development)
- `https://yourdomain.com` (add your production domain when ready)

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google` (for development)
- `https://yourdomain.com/api/auth/callback/google` (add your production domain when ready)

4. Click **"Create"**

---

## Step 5: Copy Your Credentials

After creating the OAuth client, you'll see a dialog with your credentials:

- **Client ID**: Something like `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: Something like `GOCSPX-abcdefghijklmnop`

**Important:** Copy both of these values. You'll need them in the next step.

---

## Step 6: Add Credentials to Your Application

1. Open your `.env.local` file
2. Add the following lines (replace with your actual credentials):

```bash
# Google OAuth (for NextAuth)
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

3. Save the file

---

## Step 7: Restart Your Development Server

After adding the credentials, restart your development server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## Step 8: Test Google Sign-In

1. Navigate to http://localhost:3000/login
2. Click **"Sign in with Google"**
3. You should be redirected to Google's OAuth consent screen
4. Select your Google account
5. Grant the requested permissions
6. You should be redirected back to your app and signed in

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in your Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check for trailing slashes or typos

### Error: "Access blocked: This app's request is invalid"
- Make sure you've configured the OAuth consent screen
- Add your email as a test user if the app is in testing mode

### Google sign-in button doesn't work
- Check the browser console for errors
- Verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set in `.env.local`
- Make sure you restarted the dev server after adding the credentials

---

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add your production domain to **Authorized JavaScript origins**:
   - `https://yourdomain.com`

2. Add your production callback URL to **Authorized redirect URIs**:
   - `https://yourdomain.com/api/auth/callback/google`

3. Add the environment variables to your production environment:
   - In Vercel: Go to Project Settings → Environment Variables
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

4. Redeploy your application

---

## Security Notes

- ⚠️ **Never commit your `.env.local` file to version control**
- ⚠️ Keep your `GOOGLE_CLIENT_SECRET` secure
- ⚠️ Regularly rotate your credentials if they're compromised
- ⚠️ Use different OAuth clients for development and production
