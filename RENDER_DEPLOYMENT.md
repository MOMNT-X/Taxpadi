# Deploying Taxpadi Frontend to Render

This guide explains how to deploy the Taxpadi Next.js frontend to Render.

## Prerequisites

- A [Render account](https://render.com)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Backend API URL (if already deployed)
- Google OAuth Client ID

## Deployment Steps

### 1. Connect Your Repository

1. Log in to your [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** and select **"Blueprint"**
3. Connect your Git repository
4. Render will automatically detect the `render.yaml` file

### 2. Configure Environment Variables

Before deploying, you need to set the following environment variables in the Render dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Your backend API URL | `https://taxpadi-backend.onrender.com` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789-abc.apps.googleusercontent.com` |

**To set environment variables:**
1. Go to your service in the Render dashboard
2. Navigate to **"Environment"** tab
3. Add each variable with its value
4. Click **"Save Changes"**

### 3. Deploy

- If using Blueprint (recommended): Render will automatically deploy when you connect the repository
- If manual deployment: Click **"Manual Deploy"** → **"Deploy latest commit"**

### 4. Monitor Deployment

- Watch the build logs in the Render dashboard
- The build process includes:
  - Installing dependencies (`npm ci`)
  - Building the Next.js application (`npm run build`)
  - Creating a Docker image
  - Starting the production server

### 5. Access Your Application

Once deployed, your application will be available at:
```
https://taxpadi-frontend.onrender.com
```
(The exact URL will be shown in your Render dashboard)

## Configuration Files

### `render.yaml`
Main configuration file that defines:
- Service type (web service using Docker)
- Environment variables
- Health check endpoint
- Auto-deploy settings

### `next.config.js`
Updated to include `output: 'standalone'` which is required for Docker deployment. This creates a minimal standalone build.

### `.renderignore`
Excludes unnecessary files from deployment to reduce build size and improve deployment speed.

## Deployment Options

### Free Tier
- The `render.yaml` is configured with `plan: free`
- Free services spin down after 15 minutes of inactivity
- Cold starts may take 30-60 seconds

### Paid Tier
To upgrade to a paid plan for better performance:
1. Change `plan: free` to `plan: starter` (or higher) in `render.yaml`
2. Or update the plan in the Render dashboard

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify `next.config.js` has `output: 'standalone'`

### Environment Variables Not Working
- Ensure variables starting with `NEXT_PUBLIC_` are set before build time
- Rebuild the service after adding/changing environment variables

### Application Not Starting
- Check that `PORT` is set to `3000` (default for Next.js)
- Verify the Dockerfile is correctly configured
- Check health check endpoint is accessible

## Updating Your Deployment

### Automatic Deployment
- Push changes to your `main` branch (or configured branch)
- Render will automatically rebuild and deploy

### Manual Deployment
1. Go to your service in Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Custom Domain

To add a custom domain:
1. Go to your service in Render dashboard
2. Navigate to **"Settings"** → **"Custom Domain"**
3. Follow the instructions to add your domain
4. Update DNS records as instructed

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
