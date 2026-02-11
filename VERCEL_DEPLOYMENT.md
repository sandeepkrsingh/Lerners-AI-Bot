# Vercel Deployment Guide

This guide will help you deploy your Learner Assistance Chatbot to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your GitHub repository connected to Vercel
- All environment variables ready (see below)

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push Your Code to GitHub

Make sure all your latest changes are committed and pushed:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### Step 2: Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository: `sandeepkrsingh/Lerners-AI-Bot`
4. Click **"Import"**

#### Step 3: Configure Project Settings

Vercel will auto-detect that this is a Next.js project. Configure the following:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### Step 4: Add Environment Variables

Click **"Environment Variables"** and add the following variables:

> [!IMPORTANT]
> You must add ALL these environment variables for the application to work correctly.

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://bond:Bond%40123@cluster0.8c42sum.mongodb.net/learner-autobot?retryWrites=true&w=majority&appName=Cluster0` | Your MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | `7Gpo1OKJ0X0ahbvU9LCQBz7O3YOOLedDg4cYSzZt5QU=` | Keep this secret secure |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` | **Update this after deployment** |
| `GEMINI_API_KEY` | `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` | Your Gemini API key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDv8aklchwHnyTKOEhgnJYF0ST29iFbXtg` | Firebase configuration |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `ai-agent-20db7.firebaseapp.com` | Firebase configuration |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `ai-agent-20db7` | Firebase configuration |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `ai-agent-20db7.firebasestorage.app` | Firebase configuration |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `637677283226` | Firebase configuration |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:637677283226:web:cc16e601cd34c98391fc23` | Firebase configuration |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-7BG39P3RDW` | Firebase configuration |

> [!WARNING]
> The `NEXTAUTH_URL` must be updated after your first deployment. Initially, you can use a placeholder like `https://your-app.vercel.app`, but you MUST update it to your actual Vercel URL after deployment.

#### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like `https://your-app-name.vercel.app`

#### Step 6: Update NEXTAUTH_URL

> [!CAUTION]
> This step is CRITICAL for authentication to work!

1. Copy your deployed URL (e.g., `https://learners-ai-bot.vercel.app`)
2. Go to your Vercel project settings
3. Navigate to **Settings** → **Environment Variables**
4. Find `NEXTAUTH_URL` and update it to your actual deployment URL
5. Click **"Save"**
6. Go to **Deployments** tab and click **"Redeploy"** to apply the change

---

### Method 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

Navigate to your project directory and run:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No (first time) or Yes (subsequent deployments)
- **Project name**: Accept default or customize
- **Directory**: `./`
- **Override settings**: No

#### Step 4: Add Environment Variables via CLI

```bash
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GEMINI_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

For each variable, you'll be prompted to enter the value and select the environment (Production, Preview, Development).

#### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## Post-Deployment Checklist

### 1. Verify Deployment

- [ ] Visit your deployed URL
- [ ] Check that the landing page loads correctly
- [ ] Test user registration/login
- [ ] Test chatbot functionality
- [ ] Verify admin panel access

### 2. Configure MongoDB Atlas

Ensure your MongoDB Atlas cluster allows connections from Vercel:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add Vercel's IP ranges for better security
5. Click **"Confirm"**

### 3. Update NextAuth Configuration

If you're using a custom domain:

1. Add your custom domain in Vercel project settings
2. Update `NEXTAUTH_URL` environment variable to your custom domain
3. Redeploy the application

### 4. Monitor Deployment

- Check Vercel deployment logs for any errors
- Monitor function execution times
- Set up error tracking (optional: Sentry, LogRocket)

---

## Troubleshooting

### Build Fails

**Error**: `Module not found` or dependency issues

**Solution**:
```bash
# Locally test the build
npm run build

# If successful, commit and push
git add .
git commit -m "Fix build issues"
git push
```

### Authentication Not Working

**Error**: NextAuth callback errors or redirect issues

**Solution**:
1. Verify `NEXTAUTH_URL` matches your deployment URL exactly
2. Ensure `NEXTAUTH_SECRET` is set
3. Check MongoDB connection is working

### Database Connection Fails

**Error**: `MongoServerError: bad auth` or connection timeout

**Solution**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas Network Access allows Vercel IPs
3. Ensure database user has correct permissions

### Environment Variables Not Loading

**Error**: Variables are `undefined` in production

**Solution**:
1. Verify all variables are added in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables

### API Routes Timeout

**Error**: Function execution timeout (10s limit on free tier)

**Solution**:
1. Optimize database queries
2. Add indexes to MongoDB collections
3. Consider upgrading Vercel plan for longer timeouts

---

## Continuous Deployment

Once set up, Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or pull requests

To disable auto-deployment:
1. Go to project **Settings** → **Git**
2. Configure deployment branches

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to project **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update `NEXTAUTH_URL` to your custom domain
6. Redeploy

---

## Security Best Practices

> [!IMPORTANT]
> Follow these security practices for production:

1. **Rotate Secrets**: Change `NEXTAUTH_SECRET` from the default
2. **Secure API Keys**: Never commit API keys to Git
3. **MongoDB Security**: 
   - Use strong passwords
   - Restrict IP access when possible
   - Enable MongoDB Atlas encryption
4. **Environment Variables**: Use Vercel's encrypted environment variables
5. **HTTPS Only**: Vercel provides automatic HTTPS
6. **Rate Limiting**: Consider adding rate limiting to API routes

---

## Useful Commands

```bash
# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Open project in browser
vercel open

# Pull environment variables to local
vercel env pull
```

---

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

## Quick Reference: Environment Variables

Copy this checklist when setting up environment variables:

```bash
✓ MONGODB_URI
✓ NEXTAUTH_SECRET
✓ NEXTAUTH_URL
✓ GEMINI_API_KEY
✓ NEXT_PUBLIC_FIREBASE_API_KEY
✓ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✓ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✓ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✓ NEXT_PUBLIC_FIREBASE_APP_ID
✓ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

---

**Ready to deploy?** Start with Method 1 (Vercel Dashboard) for the easiest experience! 🚀
