# Retro Ranker 2 Setup Instructions

## Environment Variables

To fix the "loading" issue on the home page, you need to set up the following
environment variables:

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# PocketBase Configuration
POCKETBASE_URL=https://pocketbase.retroranker.site
POCKETBASE_SUPERUSER_EMAIL=your-email@example.com
POCKETBASE_SUPERUSER_PASSWORD=your-password
```

### How to Get the Credentials

1. **POCKETBASE_URL**: This should point to your PocketBase instance
2. **POCKETBASE_SUPERUSER_EMAIL**: The email of a PocketBase superuser account
3. **POCKETBASE_SUPERUSER_PASSWORD**: The password for the superuser account

### Creating a Superuser Account

If you don't have a superuser account, you can create one by:

1. Accessing your PocketBase admin panel
2. Going to Settings > Users
3. Creating a new user with superuser privileges

### Alternative: Use Public Data

If you don't have access to the PocketBase instance, you can modify the code to
use mock data or a public API instead of requiring authentication.

## Current Issue

The home page was stuck in a loading state because:

1. The `DeviceService.getInstance()` method was trying to authenticate with
   PocketBase
2. The required environment variables were not set
3. The authentication was failing silently, causing the loading state to never
   resolve

## Fix Applied

I've added proper error handling that will:

1. Show a proper error message instead of infinite loading
2. Provide a retry button
3. Log detailed error information to the console

Now when you visit the home page, you'll either see:

- The actual content (if environment variables are set correctly)
- A clear error message with instructions (if environment variables are missing)
- A loading spinner (while data is being fetched)

## Next Steps

1. Create the `.env` file with the correct credentials
2. Restart the development server
3. The home page should now load properly
