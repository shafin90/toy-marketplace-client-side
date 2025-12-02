# API Configuration Guide

## Centralized API Configuration

The application uses a **centralized API configuration** system to manage the base API URL and endpoints from a single location.

## 📁 Configuration Files

### **1. Main Config File**
**Location:** `src/config/apiConfig.js`

This is the **single source of truth** for all API configuration.

```javascript
import { API_CONFIG } from '../config/apiConfig';

console.log(API_CONFIG.BASE_URL); // Current API URL
```

### **2. Environment Variables**
**Location:** `.env.local` (create this file)

```bash
# For Local Development
VITE_API_BASE_URL=http://localhost:5000

# For Production
VITE_API_BASE_URL=https://carz-server-shafin90.vercel.app
```

## 🔧 How to Switch Between Environments

### **Method 1: Using Environment Variables (Recommended)**

1. **Create `.env.local` file** in the project root:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

2. **Restart the dev server** for changes to take effect:
```bash
npm run dev
```

### **Method 2: Direct Configuration**

Edit `src/config/apiConfig.js`:

```javascript
// For Local Development
const API_BASE_URL = 'http://localhost:5000';

// For Production
// const API_BASE_URL = 'https://carz-server-shafin90.vercel.app';
```

## 📋 Available Configurations

### **Local Development**
```javascript
VITE_API_BASE_URL=http://localhost:5000
```

### **Production (Vercel)**
```javascript
VITE_API_BASE_URL=https://carz-server-shafin90.vercel.app
```

## 🎯 Usage in Code

### **In API Layer**
```javascript
// src/api/apiClient.js
import { API_CONFIG } from '../config/apiConfig';

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
});
```

### **In Components**
```javascript
import { API_CONFIG } from '../config/apiConfig';

console.log('Current API:', API_CONFIG.BASE_URL);
```

### **Using Endpoints**
```javascript
import { API_ENDPOINTS } from '../config/apiConfig';

// Get endpoint URLs
const toysURL = API_ENDPOINTS.TOYS; // '/toys'
const toyByIdURL = API_ENDPOINTS.TOY_BY_ID('123'); // '/toy/123'
```

## 🔐 Environment Variables Priority

1. **`.env.local`** - Highest priority (gitignored)
2. **`.env`** - Default values
3. **Hardcoded in `apiConfig.js`** - Fallback

## 📝 Best Practices

✅ **DO:**
- Use `.env.local` for local development
- Keep `.env.example` updated with all required variables
- Never commit `.env.local` to git
- Use environment variables for different environments

❌ **DON'T:**
- Hardcode API URLs in components
- Commit sensitive data in `.env` files
- Use different API URLs in different files

## 🚀 Deployment

### **For Vercel:**
1. Go to your Vercel project settings
2. Add environment variable:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://carz-server-shafin90.vercel.app`
3. Redeploy

### **For Other Platforms:**
Set the environment variable `VITE_API_BASE_URL` in your deployment settings.

## 🔄 Migration Guide

If you have hardcoded API URLs in your code, replace them:

**Before:**
```javascript
fetch('https://carz-server-shafin90.vercel.app/toys')
```

**After:**
```javascript
import { API_CONFIG } from '../config/apiConfig';

fetch(`${API_CONFIG.BASE_URL}/toys`)
```

Or better, use the API layer:
```javascript
import toyAPI from '../api/toyAPI';

const toys = await toyAPI.getAllToys();
```

## 📊 Configuration Structure

```
src/
├── config/
│   └── apiConfig.js          ← Main configuration file
├── api/
│   ├── apiClient.js          ← Uses API_CONFIG
│   ├── toyAPI.js
│   ├── userAPI.js
│   └── swapAPI.js
├── utils/
│   └── constants.js          ← Imports from apiConfig
└── .env.local                ← Your local environment variables
```

## 🆘 Troubleshooting

### **Changes not reflecting?**
1. Restart the dev server (`npm run dev`)
2. Clear browser cache
3. Check if `.env.local` exists and has correct values

### **API calls failing?**
1. Check `API_CONFIG.BASE_URL` value
2. Ensure backend server is running (if using localhost)
3. Check network tab in browser DevTools

### **Environment variable not working?**
1. Ensure variable name starts with `VITE_`
2. Restart dev server after creating/editing `.env.local`
3. Check for typos in variable name

## 📖 Example: Complete Setup

1. **Create `.env.local`:**
```bash
VITE_API_BASE_URL=http://localhost:5000
```

2. **Configuration is automatically loaded:**
```javascript
// src/config/apiConfig.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

3. **Use in your code:**
```javascript
import toyAPI from '../api/toyAPI';

// This will call: http://localhost:5000/toys
const toys = await toyAPI.getAllToys();
```

## ✨ Benefits

✅ **Single Source of Truth** - Change URL in one place  
✅ **Environment-Specific** - Different URLs for dev/prod  
✅ **Easy Switching** - Toggle between local and production  
✅ **Type-Safe** - Centralized endpoint definitions  
✅ **Maintainable** - Easy to update and manage  

---

**Need help?** Check `src/config/apiConfig.js` for the current configuration!
