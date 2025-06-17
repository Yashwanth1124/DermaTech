# Deployment Guide for DermaTech Care on Render

## Quick Deployment Steps

### 1. Prepare Your Repository

First, make sure your code is ready for deployment:

```bash
# Navigate to your project directory
cd c:/Users/kumma/Desktop/DermatechCare

# Install dependencies and test build
npm install
npm run build

# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit - DermaTech Care"
```

### 2. Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dermatech-care.git
git push -u origin main
```

### 3. Deploy on Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Sign in with your GitHub account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Choose "Build and deploy from a Git repository"
   - Click "Next"

3. **Connect Repository**
   - Select your GitHub account
   - Choose the `dermatech-care` repository
   - Click "Connect"

4. **Configure Service**
   Render will automatically detect the `render.yaml` file and configure:
   - **Name**: `dermatech-care`
   - **Runtime**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Environment Variables** (Auto-configured from render.yaml)
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your Neon PostgreSQL URL
   - `JWT_SECRET`: Auto-generated secure key
   - `SESSION_SECRET`: Auto-generated secure key

6. **Deploy**
   - Click "Create Web Service"
   - Render will start building and deploying your application
   - This process takes about 5-10 minutes

### 4. Verify Deployment

Once deployed, you can:

1. **Check Health Endpoints**
   - Visit: `https://your-app-name.onrender.com/`
   - Visit: `https://your-app-name.onrender.com/health`

2. **Test the Application**
   - Navigate to your app URL
   - Test user registration and login
   - Verify all features work correctly

## Environment Variables Configuration

Your `render.yaml` file includes:

```yaml
envVars:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: postgresql://neondb_owner:npg_7LwdQT1VPvFt@ep-delicate-hat-a8ytvxim-pooler.eastus2.azure.neon.tech/neondb?sslmode=require
  - key: JWT_SECRET
    generateValue: true
  - key: SESSION_SECRET
    generateValue: true
```

## Troubleshooting

### Build Failures
- Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally

### Runtime Errors
- Check the service logs in Render dashboard
- Verify environment variables are set correctly
- Test database connectivity

### Database Issues
- Ensure your Neon database is accessible
- Check the DATABASE_URL format
- Verify database schema is up to date

## Post-Deployment

### Custom Domain (Optional)
1. Go to your service settings in Render
2. Navigate to "Custom Domains"
3. Add your domain and configure DNS

### Monitoring
- Use Render's built-in monitoring
- Check logs regularly for any issues
- Set up alerts for downtime

### Updates
To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```
Render will automatically redeploy when you push to the main branch.

## Important Notes

- **Free Tier Limitations**: Render free tier spins down after 15 minutes of inactivity
- **Cold Starts**: First request after spin-down may take 30-60 seconds
- **Database**: Ensure your Neon database stays within free tier limits
- **Environment Variables**: Never commit `.env` files to git (they're in `.gitignore`)

## Support

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Review build and runtime logs in Render dashboard
3. Verify local development works correctly
4. Check GitHub repository settings and webhooks