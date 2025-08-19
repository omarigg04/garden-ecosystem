# 🚀 Deployment Guide - Digital Ecosystem Garden

## 📋 Pre-Deployment Checklist

### 1. Stripe Configuration (REQUIRED)
- [ ] Get Stripe keys from https://dashboard.stripe.com/apikeys
- [ ] Replace test keys in environment variables
- [ ] Note: You'll configure webhooks AFTER deployment

### 2. Environment Variables Ready
- [ ] Appwrite project configured ✅
- [ ] OpenAI API key ready ✅
- [ ] Stripe keys ready (get from dashboard)

## 🌐 Vercel Deployment Steps

### Step 1: GitHub Repository
```bash
# Repository should be already connected to GitHub
# Ensure all sensitive files are in .gitignore
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure settings:
   - Framework Preset: **Next.js**
   - Root Directory: **/** 
   - Build Command: **npm run build**
   - Output Directory: **.next**

### Step 3: Environment Variables in Vercel
Add these in Vercel dashboard (Settings > Environment Variables):

```bash
# Appwrite (copy from your local .env.local)
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_ENTITIES_COLLECTION_ID=your_entities_collection_id
NEXT_PUBLIC_APPWRITE_STRUCTURES_COLLECTION_ID=your_structures_collection_id
NEXT_PUBLIC_APPWRITE_DONATIONS_COLLECTION_ID=your_donations_collection_id

# OpenAI (copy from your local .env.local) 
OPENAI_API_KEY=your_openai_api_key

# Stripe (GET FROM STRIPE DASHBOARD)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_
STRIPE_SECRET_KEY=sk_test_... # or sk_live_
STRIPE_WEBHOOK_SECRET=whsec_... # You'll get this in Step 4

# App URL (will be your Vercel domain)
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

### Step 4: Deploy
- Click **"Deploy"**
- Wait for build to complete (2-3 minutes)
- Get your production URL: `https://your-app-name.vercel.app`

## 🎯 Post-Deployment: Stripe Webhook Setup

### Step 1: Configure Stripe Webhook
1. Go to https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter endpoint URL: `https://your-app-name.vercel.app/api/webhook/stripe`
4. Select events: **`checkout.session.completed`**
5. Click **"Add endpoint"**

### Step 2: Get Webhook Secret
1. Click on your newly created webhook
2. Go to **"Signing secret"** 
3. Click **"Reveal"** and copy the secret (starts with `whsec_`)
4. Add this to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 3: Test Your Deployment
- [ ] Visit your live URL
- [ ] Test payment flow with test card: 4242 4242 4242 4242
- [ ] Verify entities appear in ecosystem
- [ ] Check Appwrite dashboard for new records

## 🔧 Troubleshooting

### Build Errors
- Check all environment variables are set in Vercel
- Verify TypeScript compilation locally first
- Check Vercel function logs for errors

### Payment Issues  
- Verify webhook URL is correctly configured
- Check Stripe dashboard for webhook delivery attempts
- Ensure webhook secret matches in environment variables

---

**🎉 Your Digital Ecosystem Garden will be live and creating AI beings!**