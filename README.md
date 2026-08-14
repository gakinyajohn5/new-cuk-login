# CUK E-MASOMO Login Portfolio Demo — Deployment Guide

This connects your login page to GitHub and Netlify so that:
- Your site is live at a public link (e.g. `https://your-site.netlify.app`)
- Every login attempt (email + password typed on the Staff/Student pages)
  gets saved as a new row in `submissions/logins.csv` **inside your own
  GitHub repo** — so you can see it by logging into your GitHub account
  and opening that file.

## 1. Push this folder to GitHub

1. Create a new **public or private** repository on GitHub, e.g. `cuk-login-portfolio`.
2. In this folder, run:
   ```
   git init
   git add .
   git commit -m "Initial CUK login demo"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cuk-login-portfolio.git
   git push -u origin main
   ```
3. Add your logo image at `images/download.png` before pushing (or after, then commit again).

## 2. Create a GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**.
2. Create a token scoped only to your `cuk-login-portfolio` repo.
3. Give it **Read and write** access to "Contents".
4. Copy the token — you'll paste it into Netlify next (you won't be able to see it again).

## 3. Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Choose GitHub, then select your `cuk-login-portfolio` repo.
3. Build settings: leave build command empty, publish directory `.` (this is already set in `netlify.toml`).
4. Before deploying, go to **Site settings → Environment variables** and add:
   - `GITHUB_TOKEN` = the token you generated
   - `GITHUB_OWNER` = your GitHub username
   - `GITHUB_REPO` = `cuk-login-portfolio` (or whatever you named it)
   - `GITHUB_BRANCH` = `main`
5. Click **Deploy site**. Netlify gives you a live link like `https://cuk-login-demo.netlify.app`.

## 4. Test it

1. Open your Netlify link → click **Staff Login** or **Student Login**.
2. Type any email/password → click **Continue with Google**.
3. Go to your GitHub repo in the browser → open `submissions/logins.csv`.
4. You'll see a new row appear each time someone submits the form (may take a few seconds).

## Notes

- The `submissions/logins.csv` file is created automatically the first time someone submits the form — you don't need to make it yourself.
- Passwords are stored in plain text for this demo. Never do this in a real production app — this setup is for portfolio/demo purposes only.
- If you'd rather keep submissions private, make the GitHub repo **private** — the Netlify function will still be able to write to it using your token.
