# ProsApp - UI Generation Prompt

## App Overview
Student event attendance management system using React Native + Expo (mobile & web).

## User Roles
- **Admin**: Dashboard, manage events (CRUD), manage users, view statistics
- **User**: View active events, scan barcodes (mobile) or manual input (web), view my attendances

## Tech Stack
- React Native + Expo SDK 52+
- Expo Router
- TypeScript
- Supabase backend

## Color Palette
- Primary: `#2563eb` | Success: `#16a34a` | Warning: `#d97706` | Danger: `#dc2626`
- Background: `#f8fafc` | Surface: `#ffffff` | Text: `#1e293b` | Muted: `#64748b`

## Platform Differences

### Mobile
- Bottom Tab Navigation
- Camera barcode scanner
- Pull-to-refresh
- Haptic feedback
- Safe Area Insets

### Web
- Sidebar Navigation
- Manual text input (no camera)
- Hover states
- Multi-column layouts (desktop)
- Data tables for lists

## Core Components Needed
1. **Button** - primary/secondary/danger/outline variants, loading state
2. **Card** - elevated/outlined, pressable
3. **Input** - with label, error state, icons
4. **Badge** - status indicators (Active/Inactive)
5. **StatsCard** - icon + number + label
6. **EventCard** - name, category, dates, location, status
7. **Modal/BottomSheet** - BottomSheet on mobile, Modal on web
8. **Skeleton** - loading placeholders
9. **EmptyState** - empty list illustrations

## Key Screens

### Admin Dashboard
- Welcome header
- 4 stat cards (grid)
- Quick action buttons
- Recent events list

### Scanner (User)
- Mobile: Camera with scan overlay
- Web: Large centered input + submit button
- Recent scans list

## Styling
- Border radius: 12-16px
- Padding: 16-24px
- Font sizes: Title 24px, Body 16px, Caption 13px
- Touch targets: min 48x48px

## Platform Detection
```typescript
import { Platform } from 'react-native';
const isWeb = Platform.OS === 'web';
```

## Design References
Vercel, Linear, Stripe dashboards - clean, modern, functional.

