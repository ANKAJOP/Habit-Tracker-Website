# 🔐 Fix Git Authentication Issue

## Problem
Git is using cached credentials from another account (AshutoshkumarVesit) instead of your account (ANKAJOP).

---

## ✅ Solution Options

### Option 1: Clear Credentials via Windows Credential Manager (Easiest)

1. **Press** `Windows Key + R`
2. **Type:** `control /name Microsoft.CredentialManager`
3. **Press Enter**
4. Click **"Windows Credentials"**
5. **Find and remove** any entries for:
   - `git:https://github.com`
   - `github.com`
6. Click each one → **"Remove"**
7. **Try pushing again:**
   ```powershell
   git push -u origin main
   ```

### Option 2: Use PowerShell Command (Quick)

```powershell
# Remove stored credentials
cmdkey /delete:LegacyGeneric:target=git:https://github.com

# Try pushing again
git push -u origin main
```

### Option 3: Use GitHub Personal Access Token (Most Reliable)

Since password authentication is deprecated, use a token:

1. **Go to GitHub:** https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. **Settings:**
   - Note: `HabitTracker Deployment`
   - Expiration: `90 days` (or No expiration)
   - **Check:** `repo` (all sub-options)
4. Click **"Generate token"**
5. **COPY THE TOKEN** (you won't see it again!)

6. **Push with token:**
   ```powershell
   git push -u origin main
   ```
   
   **When prompted:**
   - Username: `ANKAJOP`
   - Password: `paste_your_token_here`

### Option 4: Use SSH Instead of HTTPS (Advanced)

If you want to avoid passwords altogether:

1. **Generate SSH key:**
   ```powershell
   ssh-keygen -t ed25519 -C "ankajbind2004@gmail.com"
   # Press Enter 3 times (default location, no passphrase)
   ```

2. **Copy public key:**
   ```powershell
   cat ~/.ssh/id_ed25519.pub | clip
   ```

3. **Add to GitHub:**
   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key
   - Click "Add SSH key"

4. **Change remote URL to SSH:**
   ```powershell
   git remote set-url origin git@github.com:ANKAJOP/Habit-Tracker-Website.git
   ```

5. **Push:**
   ```powershell
   git push -u origin main
   ```

---

## 🎯 Recommended: Option 1 or Option 3

**Fastest:** Option 1 (Clear credentials via Windows)

**Most Secure:** Option 3 (Use Personal Access Token)

---

## 📝 After Fixing Authentication

Once credentials are cleared, when you run:
```powershell
git push -u origin main
```

You'll see a browser window or prompt for login. Use:
- **Username:** `ANKAJOP`
- **Password:** Your GitHub password OR Personal Access Token

---

## ✅ Verify Success

After successful push, you should see:
```
Enumerating objects: 100, done.
Counting objects: 100% (100/100), done.
Delta compression using up to 8 threads
Compressing objects: 100% (85/85), done.
Writing objects: 100% (100/100), 450.50 KiB | 5.50 MiB/s, done.
Total 100 (delta 10), reused 0 (delta 0), pack-reused 0
To https://github.com/ANKAJOP/Habit-Tracker-Website.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

Then your code is on GitHub! 🎉

---

## 🚨 Quick Fix Right Now

**Try this immediately:**

```powershell
# Clear any cached credentials
git config --global --unset credential.helper

# Push again (will ask for credentials)
git push -u origin main
```

When prompted, enter:
- Username: `ANKAJOP`
- Password: Your GitHub password or token

---

Let me know which option you want to try!
