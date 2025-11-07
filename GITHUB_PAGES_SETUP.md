# GitHub Pages Setup Guide

Follow these steps to make your website live at **thephoenixflix.github.io**

## Step 1: Initialize Git Repository (if not already done)

```bash
cd thephoenixflix_CV
git init
git add .
git commit -m "Initial commit - The Phoenix Flix CV"
```

## Step 2: Connect to GitHub Repository

```bash
git remote add origin https://github.com/thephoenixflix/thephoenixflix.github.io.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository: https://github.com/thephoenixflix/thephoenixflix.github.io
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**

## Step 4: Wait for Deployment

- GitHub will automatically build and deploy your site
- It may take 1-2 minutes for the first deployment
- You'll see a green checkmark when it's ready

## Step 5: Access Your Website

Your site will be live at:
**https://thephoenixflix.github.io**

## Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will automatically deploy your site whenever you push changes to the `main` branch.

## Troubleshooting

- If the site doesn't load, check the **Actions** tab in your repository for any errors
- Make sure `index.html` is in the root directory
- Ensure all image files are included in the repository
- Check that the branch name is `main` (not `master`)

## Updating Your Site

Simply push changes to the `main` branch:

```bash
git add .
git commit -m "Update website"
git push origin main
```

The site will automatically update within 1-2 minutes!

