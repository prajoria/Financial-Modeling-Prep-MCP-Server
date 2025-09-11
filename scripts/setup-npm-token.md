# NPM Token Setup Guide

This guide helps you set up the NPM token for automated publishing in GitHub Actions.

## Step 1: Generate NPM Token

1. **Login to NPM** (if not already logged in):
   ```bash
   npm login
   ```

2. **Create an automation token**:
   ```bash
   npm token create --type=automation
   ```

3. **Copy the generated token** (it will look like `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## Step 2: Add Token to GitHub Secrets

1. **Navigate to your repository** on GitHub
2. **Go to Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Set the secret**:
   - **Name**: `NPM_TOKEN`
   - **Secret**: Paste the token from Step 1
5. **Click "Add secret"**

## Step 3: Verify Setup

1. **Create a test tag** (optional):
   ```bash
   git tag v0.0.1-test
   git push origin v0.0.1-test
   ```

2. **Check the Actions tab** to see if the workflow runs successfully

3. **Delete the test tag** if everything works:
   ```bash
   git tag -d v0.0.1-test
   git push origin :refs/tags/v0.0.1-test
   ```

## Token Security

- **Never commit NPM tokens** to your repository
- **Use automation tokens** for CI/CD (not personal tokens)
- **Rotate tokens periodically** for security
- **Limit token scope** to only necessary permissions

## Troubleshooting

**Token not working?**
- Ensure the token has publish permissions
- Check that the token hasn't expired
- Verify the secret name is exactly `NPM_TOKEN`

**Permission denied?**
- Ensure your NPM account has publish permissions for the package
- For new packages, ensure the name is available

**Workflow failing?**
- Check the Actions logs for detailed error messages
- Ensure all tests pass locally before pushing tags