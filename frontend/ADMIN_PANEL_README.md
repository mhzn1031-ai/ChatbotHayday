# Fictora Labs Admin Panel Frontend

A complete React TypeScript admin panel for the SaaS chatbot builder platform, built with Fictora Labs branding and design guidelines.

## Features

- **User Authentication**: Login and registration with email/password
- **Bot Management**: Create, edit, delete, and manage chatbots
- **Document Upload**: Support for PDF, DOCX, and TXT files
- **Website Scraping**: Add chatbots from website URLs
- **Bot Customization**: Customize appearance, colors, fonts, and behavior
- **Embed Code Generation**: Generate script, iframe, and React component code
- **Subscription Management**: Free, Pro, and Business plans with usage tracking
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Design System

### Colors
- **Mystic Teal**: `#002C4D` (primary), `#012145` (secondary), `#051D43` (tertiary), `#3AA0B7` (accent)
- **Neon Lime**: `#E7FF00`
- **Neural Mint**: `#D8ECD1`

### Typography
- **Font**: Inter (with fallbacks to Poppins, Montserrat)
- **Clean, modern sans-serif styling**

### Branding
- **Logo**: Magician's wand with spark (minimum 35px wide)
- **Placement**: Top left corner, never stretched or recolored
- **Pattern**: Subtle brand pattern backgrounds

## Folder Structure

```
src/admin/
├── layouts/
│   └── AdminLayout.tsx          # Main layout with sidebar navigation
├── pages/
│   ├── Dashboard.tsx            # Main dashboard with stats and overview
│   ├── Login.tsx                # User login page
│   ├── Register.tsx             # User registration page
│   ├── BotManagement.tsx        # List and manage bots
│   ├── BotCreation.tsx          # Create new bots (multi-step form)
│   ├── BotCustomization.tsx     # Customize bot appearance and behavior
│   ├── EmbedCode.tsx            # Generate embed codes
│   └── Subscription.tsx         # Manage subscription and billing
├── components/                  # Reusable components (if needed)
└── index.ts                     # Export all components

src/styles/
└── globals.css                  # Global styles with brand colors and utilities
```

## Installation & Setup

### 1. Install Dependencies

The admin panel uses these key dependencies (already in your package.json):

```bash
npm install react react-dom typescript
npm install react-router-dom zustand
npm install tailwindcss autoprefixer postcss
npm install lucide-react react-hook-form
npm install axios react-query
```

### 2. Configure Tailwind CSS

Update your `tailwind.config.js` with the provided configuration that includes Fictora Labs brand colors.

### 3. Import Global Styles

Add the global styles to your main entry point:

```tsx
// In your main.tsx or index.tsx
import './styles/globals.css';
```

### 4. Basic Integration

```tsx
import React from 'react';
import { Dashboard, Login, AdminLayout } from './admin';

function App() {
  return (
    <div className="App">
      {/* Example: Show login page */}
      <Login 
        onLogin={(email, password) => {
          console.log('Login:', { email, password });
        }}
      />
      
      {/* Example: Show dashboard */}
      <Dashboard />
      
      {/* Example: Custom page with admin layout */}
      <AdminLayout currentPage="custom">
        <div>Your custom content here</div>
      </AdminLayout>
    </div>
  );
}
```

## Integration with Next.js

### 1. Create Pages

```tsx
// pages/admin/dashboard.tsx
import { Dashboard } from '../src/admin';

export default function AdminDashboard() {
  return <Dashboard />;
}

// pages/admin/bots.tsx
import { BotManagement } from '../src/admin';

export default function AdminBots() {
  return <BotManagement />;
}
```

### 2. Add Authentication

```tsx
// pages/admin/login.tsx
import { Login } from '../src/admin';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const router = useRouter();
  
  const handleLogin = async (email: string, password: string) => {
    // Your authentication logic
    const success = await authenticateUser(email, password);
    if (success) {
      router.push('/admin/dashboard');
    }
  };

  return <Login onLogin={handleLogin} />;
}
```

### 3. Protected Routes

```tsx
// components/ProtectedRoute.tsx
import { useAuth } from '../hooks/useAuth';
import { Login } from '../src/admin';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  
  return <>{children}</>;
}
```

## Component Props

### AdminLayout
```tsx
interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string; // 'dashboard' | 'bots' | 'customize' | 'embed' | 'subscription'
}
```

### Login
```tsx
interface LoginProps {
  onLogin?: (email: string, password: string) => void;
  onSwitchToRegister?: () => void;
}
```

### Register
```tsx
interface RegisterProps {
  onRegister?: (email: string, password: string, name: string) => void;
  onSwitchToLogin?: () => void;
}
```

## Customization

### Colors
Update the CSS custom properties in `globals.css`:

```css
:root {
  --mystic-teal-primary: #002C4D;
  --mystic-teal-secondary: #012145;
  --mystic-teal-accent: #3AA0B7;
  --neon-lime: #E7FF00;
  --neural-mint: #D8ECD1;
}
```

### Fonts
Change the font family in `globals.css` and `tailwind.config.js`:

```css
body {
  font-family: 'Your-Font', 'Inter', sans-serif;
}
```

### Logo
Replace the `Wand2` icon in `AdminLayout.tsx` with your actual logo:

```tsx
// Replace this:
<Wand2 className="w-6 h-6 text-neon-lime" />

// With your logo:
<img src="/path/to/logo.svg" alt="Fictora Labs" className="w-8 h-8" />
```

## API Integration

The components include placeholder functions for API calls. Replace these with your actual API endpoints:

```tsx
// Example: In BotManagement.tsx
const handleCreateBot = async () => {
  try {
    const response = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(botData)
    });
    const newBot = await response.json();
    // Update state
  } catch (error) {
    console.error('Failed to create bot:', error);
  }
};
```

## State Management

The components use local state with `useState`. For production, consider integrating with:

- **Zustand** (already in dependencies)
- **Redux Toolkit**
- **React Query** (already in dependencies) for server state

Example with Zustand:

```tsx
// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    // API call
    const user = await authenticateUser(email, password);
    set({ user, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

## Responsive Design

All components are fully responsive and work on:
- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Overlay sidebar with hamburger menu

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Code Splitting**: Use dynamic imports for large components
- **Lazy Loading**: Implement lazy loading for images and heavy components
- **Memoization**: Use `React.memo` for expensive components

## Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Meets WCAG 2.1 AA standards
- **Focus Management**: Clear focus indicators

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Include proper prop types and interfaces
4. Test on multiple screen sizes
5. Maintain Fictora Labs branding consistency

## Support

For questions or issues with the admin panel components, please refer to the main project documentation or contact the development team.