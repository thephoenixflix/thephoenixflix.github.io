# Publishing CV to GitHub

## Steps to Publish

### 1. Navigate to your CV directory
```bash
cd D:\CV\BenTran_CV
```

### 2. Initialize Git repository (if not already initialized)
```bash
git init
```

### 3. Add the remote repository
```bash
git remote add origin https://github.com/PhoenixWeaver/BT_RF_CV.git
```

Or if the remote already exists, update it:
```bash
git remote set-url origin https://github.com/PhoenixWeaver/BT_RF_CV.git
```

### 4. Add files to staging
```bash
git add BenTran_CV_Radar_Satellite.html
git add README.md
git add index.html
```

Or add all files:
```bash
git add .
```

### 5. Commit the changes
```bash
git commit -m "Add interactive RF & Microwave Engineer CV with radar and satellite themes"
```

### 6. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## Enable GitHub Pages (Optional)

To make your CV viewable online:

1. Go to your repository: https://github.com/PhoenixWeaver/BT_RF_CV
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**
7. Your CV will be available at: `https://phoenixweaver.github.io/BT_RF_CV/BenTran_CV_Radar_Satellite.html`

## Quick One-Line Commands

If you want to do everything at once:

**For ThePhoenixFlix (public account):**
```bash
cd D:\CV && git init && git remote add origin https://github.com/ThePhoenixFlix/BT_RF_CV.git && git add . && git commit -m "Add interactive RF & Microwave Engineer CV" && git branch -M main && git push -u origin main
```

**For PhoenixWeaver (private account):**
```bash
cd D:\CV && git init && git remote add origin https://github.com/PhoenixWeaver/BT_RF_CV.git && git add . && git commit -m "Add interactive RF & Microwave Engineer CV" && git branch -M main && git push -u origin main
```

