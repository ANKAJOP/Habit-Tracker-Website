# 🔑 Create GitHub Personal Access Token

## Why You Need This
GitHub no longer accepts passwords for Git operations. You need a Personal Access Token (PAT).

---

## 📋 Step-by-Step Instructions

### Step 1: Create Personal Access Token

1. **Go to:** https://github.com/settings/tokens

2. Click **"Generate new token"** → **"Generate new token (classic)"**

3. **Fill in:**
   - **Note:** `HabitTracker Deployment`
   - **Expiration:** `90 days` (or choose longer)
   
4. **Select scopes** - Check these boxes:
   - ✅ **repo** (Full control of private repositories)
     - This automatically checks all sub-items

5. **Scroll down** and click **"Generate token"**

6. **IMPORTANT:** Copy the token immediately!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again!
   - Save it somewhere safe temporarily

---

### Step 2: Push to GitHub Using Token

Now use the token as your password:

```powershell
git push -u origin main
```

**When prompted for credentials:**
- **Username:** `ANKAJOP`
- **Password:** `paste_your_token_here` (the ghp_xxx... token)

**Or push directly with token in URL (one-time):**
```powershell
git push https://ANKAJOP:YOUR_TOKEN_HERE@github.com/ANKAJOP/Habit-Tracker-Website.git main
```

---

### Step 3: Store Credentials (Optional)

To avoid entering token every time:

```powershell
# Store credentials permanently
git config --global credential.helper store

# Now push (will be saved after this)
git push -u origin main
```

**Note:** This stores credentials in plain text. For better security, use:
```powershell
git config --global credential.helper wincred
```

---

## 🎯 Quick Reference

**Your GitHub Details:**
- Username: `ANKAJOP`
- Repository: `Habit-Tracker-Website`
- URL: https://github.com/ANKAJOP/Habit-Tracker-Website

**Token Requirements:**
- Scope needed: `repo`
- Used for: Password when pushing/pulling

---

## ✅ After Token is Created

1. **Copy the token** (ghp_xxxxx...)
2. **Run:**
   ```powershell
   git push -u origin main
   ```
3. **Enter:**
   - Username: `ANKAJOP`
   - Password: `<paste token>`
4. **Done!** Code will upload to GitHub

---

## 🔄 Alternative: Push with Token in Command

If prompt doesn't appear, push directly:

```powershell
# Format: https://USERNAME:TOKEN@github.com/USERNAME/REPO.git
git remote set-url origin https://ANKAJOP:YOUR_TOKEN@github.com/ANKAJOP/Habit-Tracker-Website.git
git push -u origin main
```

Then set it back to normal URL:
```powershell
git remote set-url origin https://github.com/ANKAJOP/Habit-Tracker-Website.git
```

---

## 📞 Direct Links

- **Create Token:** https://github.com/settings/tokens/new
- **Your Repository:** https://github.com/ANKAJOP/Habit-Tracker-Website
- **GitHub Docs:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

---

## 🎊 Next Steps After Successful Push

Once you see "Branch 'main' set up to track remote branch 'main' from 'origin'":

1. ✅ Code is on GitHub
2. ➡️ Deploy backend on Render
3. ➡️ Deploy frontend on Vercel
4. 🎉 Your app is live!

Refer to **GITHUB_DEPLOYMENT_STEPS.md** for deployment instructions.
