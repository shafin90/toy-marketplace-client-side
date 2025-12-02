# 3-Layer Architecture Documentation

## Overview
This application follows a **3-Layer Architecture** pattern for better code organization, maintainability, and separation of concerns.

## Architecture Layers

### 📊 **Layer 1: Data Access Layer (API)**
**Location:** `src/api/`

**Purpose:** Handles all HTTP requests and communication with the backend API.

**Files:**
- `apiClient.js` - Axios instance with interceptors
- `toyAPI.js` - Toy-related API calls
- `userAPI.js` - User-related API calls
- `swapAPI.js` - Swap-related API calls

**Responsibilities:**
- Make HTTP requests (GET, POST, PUT, DELETE)
- Handle request/response interceptors
- Manage API endpoints
- Return raw data from server

**Example:**
```javascript
import toyAPI from '../api/toyAPI';

// Get all toys
const toys = await toyAPI.getAllToys();

// Get toy by ID
const toy = await toyAPI.getToyById('123');
```

---

### 🧠 **Layer 2: Business Logic Layer (Services)**
**Location:** `src/services/`

**Purpose:** Contains business logic, data transformation, and validation.

**Files:**
- `toyService.js` - Toy business logic
- `userService.js` - User business logic
- `swapService.js` - Swap business logic

**Responsibilities:**
- Process and transform data
- Implement business rules
- Validate data
- Handle complex operations
- Manage localStorage
- Error handling with user-friendly messages

**Example:**
```javascript
import toyService from '../services/toyService';

// Search toys (business logic)
const results = toyService.searchToys(toys, 'car');

// Sort toys (business logic)
const sorted = toyService.sortToysByPrice(toys, 'asc');

// Check affordability (business rule)
const canAfford = toyService.canAffordToy(userCredits, toyCost);
```

---

### 🎨 **Layer 3: Presentation Layer (UI Components)**
**Location:** `src/component/`, `src/context/`, `src/hooks/`

**Purpose:** Handles UI rendering and user interactions.

**Components:**
- React Components (Banner, Header, Footer, etc.)
- Context Providers (UserContext)
- Custom Hooks (useToys, useSwap, etc.)

**Responsibilities:**
- Render UI
- Handle user interactions
- Manage component state
- Use services for data operations
- Display data to users

**Example:**
```javascript
import { useUser } from '../context/UserContext';
import useToys from '../hooks/useToys';
import useSwap from '../hooks/useSwap';

function ToyCard({ toy }) {
    const { user, credits } = useUser();
    const { performSwap, canSwap } = useSwap();
    
    const handleSwap = async () => {
        await performSwap(toy);
    };
    
    return (
        <div>
            <h3>{toy.name}</h3>
            <p>💎 {toy.creditCost} Credits</p>
            <button 
                onClick={handleSwap}
                disabled={!canSwap(toy)}
            >
                Swap Now
            </button>
        </div>
    );
}
```

---

## Data Flow

```
User Interaction (UI)
    ↓
Custom Hook (useSwap)
    ↓
Service Layer (swapService)
    ↓
API Layer (swapAPI)
    ↓
Backend Server
    ↓
Database
```

**Example Flow - Swapping a Toy:**

1. **User clicks "Swap" button** (Presentation Layer)
2. **useSwap hook is triggered** (Presentation Layer)
3. **swapService.performSwap()** validates and processes (Business Logic Layer)
4. **swapAPI.swapToy()** makes HTTP request (Data Access Layer)
5. **Backend processes** the swap
6. **Response flows back** through layers
7. **UI updates** with new credit balance

---

## Context & State Management

### **UserContext**
**Location:** `src/context/UserContext.jsx`

**Purpose:** Global user state management

**Provides:**
- `user` - Current user object
- `credits` - User's credit balance
- `isLoggedIn` - Authentication status
- `login()` - Login/register function
- `logout()` - Logout function
- `refreshCredits()` - Refresh credit balance

**Usage:**
```javascript
import { useUser } from '../context/UserContext';

function MyComponent() {
    const { user, credits, login, logout } = useUser();
    
    return (
        <div>
            {user ? (
                <>
                    <p>Welcome, {user.name}!</p>
                    <p>Credits: {credits}</p>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <button onClick={() => login(userData)}>Login</button>
            )}
        </div>
    );
}
```

---

## Custom Hooks

### **useToys**
Fetches and manages all toys data.

```javascript
const { toys, loading, error, refreshToys } = useToys();
```

### **useToyDetails**
Fetches single toy details.

```javascript
const { toy, loading, error, refreshToy } = useToyDetails(toyId);
```

### **useSwap**
Manages swap operations.

```javascript
const { performSwap, canSwap, loading } = useSwap();
```

---

## Utility Functions

### **helpers.js**
Common utility functions:
- `formatCredits(credits)` - Format credit display
- `formatDate(dateString)` - Format dates
- `truncateText(text, maxLength)` - Truncate long text
- `isValidEmail(email)` - Email validation
- `getInitials(name)` - Get user initials
- `debounce(func, wait)` - Debounce function calls

### **constants.js**
Application constants:
- API configuration
- Credit system settings
- Toy categories and conditions
- Routes
- Toast messages

---

## Benefits of This Architecture

✅ **Separation of Concerns** - Each layer has a specific responsibility
✅ **Maintainability** - Easy to find and fix bugs
✅ **Testability** - Each layer can be tested independently
✅ **Reusability** - Services and hooks can be reused
✅ **Scalability** - Easy to add new features
✅ **Code Organization** - Clear structure and file organization
✅ **Error Handling** - Centralized error management
✅ **Type Safety** - Clear data flow and contracts

---

## Best Practices

1. **Never call API directly from components** - Always use services
2. **Keep business logic in services** - Not in components
3. **Use custom hooks for data fetching** - Reusable and clean
4. **Use context for global state** - Avoid prop drilling
5. **Handle errors at service layer** - User-friendly messages
6. **Validate data in services** - Before API calls
7. **Use constants** - Avoid magic strings/numbers
8. **Document functions** - JSDoc comments

---

## Example: Adding a New Feature

**Task:** Add a "favorite toys" feature

### Step 1: Data Access Layer
```javascript
// src/api/favoriteAPI.js
const favoriteAPI = {
    getFavorites: async (email) => {
        const response = await apiClient.get(`/favorites?email=${email}`);
        return response.data;
    },
    addFavorite: async (toyId, email) => {
        const response = await apiClient.post('/favorites', { toyId, email });
        return response.data;
    },
};
```

### Step 2: Business Logic Layer
```javascript
// src/services/favoriteService.js
const favoriteService = {
    getUserFavorites: async (email) => {
        try {
            const favorites = await favoriteAPI.getFavorites(email);
            return favorites;
        } catch (error) {
            throw new Error('Failed to fetch favorites');
        }
    },
    toggleFavorite: async (toyId, email) => {
        // Business logic here
    },
};
```

### Step 3: Presentation Layer
```javascript
// src/hooks/useFavorites.js
const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    
    const fetchFavorites = async () => {
        const data = await favoriteService.getUserFavorites(email);
        setFavorites(data);
    };
    
    return { favorites, fetchFavorites };
};

// Use in component
function ToyCard() {
    const { favorites, fetchFavorites } = useFavorites();
    // Render UI
}
```

---

## Folder Structure

```
src/
├── api/                    # Layer 1: Data Access
│   ├── apiClient.js
│   ├── toyAPI.js
│   ├── userAPI.js
│   └── swapAPI.js
├── services/               # Layer 2: Business Logic
│   ├── toyService.js
│   ├── userService.js
│   └── swapService.js
├── context/                # Layer 3: State Management
│   └── UserContext.jsx
├── hooks/                  # Layer 3: Custom Hooks
│   ├── useToys.js
│   ├── useToyDetails.js
│   └── useSwap.js
├── component/              # Layer 3: UI Components
│   ├── Banner/
│   ├── Header/
│   └── ...
├── utils/                  # Utilities
│   ├── helpers.js
│   └── constants.js
└── main.jsx               # App entry point
```

---

## Summary

This 3-layer architecture provides:
- **Clear separation** between data, logic, and presentation
- **Easy maintenance** and debugging
- **Reusable code** across components
- **Testable units** at each layer
- **Scalable structure** for future growth

Follow this pattern when adding new features to maintain consistency and code quality! 🚀
