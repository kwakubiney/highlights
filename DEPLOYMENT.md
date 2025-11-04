# GitHub Pages Setup Guide

## How to Deploy Your Site

Your site won't show up yet because we need to tell GitHub which deployment source to use. Follow these exact steps:

### Step 1: Go to GitHub Repository Settings

1. Open: https://github.com/kwakubiney/highlights
2. Click **Settings** (gear icon at top right)
3. In the left sidebar, scroll down and click **Pages**

### Step 2: Configure Build and Deployment

On the Pages settings page, you'll see **Build and deployment** section:

**Before (current - wrong):**
- Source: "Deploy from a branch"
- Shows the README ❌

**After (what we need):**
1. Change **Source** from "Deploy from a branch" → **"GitHub Actions"**
2. Click **Save**

That's it! ✅

### Step 3: Watch the Deployment

1. Go to **Actions** tab at the top of your repo
2. Click on the latest workflow run (should say "Deploy to GitHub Pages")
3. Watch it build and deploy (takes about 1-2 minutes)
4. Once it shows ✅ (checkmark), your site is live!

### Step 4: View Your Site

Your site will be available at:

```
https://kwakubiney.github.io/highlights/
```

---

## What Happens Automatically Now

Every time you push to `master`:

1. ✅ GitHub Actions runs the build workflow
2. ✅ Next.js builds your app to static files
3. ✅ Files are uploaded to GitHub Pages
4. ✅ Your site automatically updates

## To Update Your Highlights

Run this locally whenever you want to update:

```bash
python3 export_highlights.py
```

Then commit and push:

```bash
git add public/highlights.json
git commit -m "Update highlights"
git push origin master
```

GitHub Actions will automatically redeploy your site with the new data! 🚀

