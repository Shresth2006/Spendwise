# SpendWise - Complete Screen Guide

## Overview
SpendWise is a complete mobile finance application with 13 distinct screens, designed for iOS (iPhone 14/15 - 393×852).

## Screen Flow & Navigation

### 🎬 Onboarding Flow (Auto-progresses)
1. **Splash Screen** → Auto-navigates to Auth after 2 seconds
2. **Authentication** → Sign in/Sign up with email, phone, or Google
3. **Welcome Screen** → Personalized name input (Step 1/3)
4. **Category Personalization** → Select spending categories (Step 2/3)
5. **Budget Setup** → Set monthly budget and category limits (Step 3/3)
6. **Home Dashboard** → Main app screen

### 🏠 Main App Screens (Bottom Navigation)

#### Home Tab
- **Home Dashboard** - Main overview with:
  - Monthly spending progress
  - Budget prediction alert
  - Quick stats
  - Recent transactions
  - Quick Add Expense FAB

#### Calendar Tab
- **Spending Calendar** - Monthly calendar with:
  - Color-coded spending days (green/yellow/red)
  - Day-by-day expense breakdown
  - Interactive date selection

#### Goals Tab
- **Goals & Savings** - Savings goals tracking with:
  - Total savings overview
  - Individual goal cards
  - Progress tracking
  - Smart suggestions

#### Analytics Tab
- **Analytics** - Spending insights with:
  - Category breakdown (pie chart)
  - Monthly trends (bar chart)
  - Month-over-month comparison
  - Top spending days

#### Settings Tab
- **Settings** - Account & preferences:
  - Profile management
  - Budget preferences
  - Notification controls
  - Dark mode toggle
  - Data sync status
  - Logout option

### 📱 Modal/Detail Screens

#### From Home Dashboard:
- **Budget Prediction** - Detailed spending forecast with:
  - Trend line chart
  - Smart insights
  - Budget alerts
  - Suggested actions

- **Add Expense** - Quick expense entry with:
  - Amount input
  - Auto-categorization
  - Date picker
  - Notes field
  - Success animation

- **Group Expenses** - Pending payments with:
  - Contact-based list
  - FIFO ordering (oldest first)
  - SMS auto-detection
  - Payment tracking

## Design System

### Color Palette
- **Primary**: Deep Purple (#9333ea)
- **Secondary**: Blue (#3b82f6)
- **Background**: Gradient from purple-50 to blue-50
- **Success**: Green
- **Warning**: Yellow/Orange
- **Error**: Red

### Component Patterns
- **Card-based layout** with glassmorphism
- **Rounded corners**: 16-24px
- **Bottom navigation**: 5 tabs
- **FAB**: Quick Add Expense
- **8pt grid system**

### Typography
- Uses default typography from globals.css
- No explicit font-size/weight classes unless necessary

## Key Features

### ✨ Smart Features
1. **Auto-categorization** - AI-suggested categories for expenses
2. **SMS parsing** - Auto-detect split payments from messages
3. **Predictive alerts** - Proactive budget warnings
4. **Smart suggestions** - Personalized financial nudges
5. **FIFO payment tracking** - Oldest-first pending payment ordering

### 📊 Data Visualization
- Circular progress indicators
- Pie charts (category breakdown)
- Line charts (budget prediction)
- Bar charts (monthly trends)
- Color-coded calendar

### 🎨 UX Principles
- Personal, friendly language
- Non-shaming financial guidance
- Clear visual hierarchy
- Smooth transitions
- Success feedback animations

## Navigation Map

```
Splash → Auth → Welcome → Categories → Budget → Home
                                                  ↓
                        ┌─────────────────────────┴─────────────┐
                        ↓                                       ↓
            Bottom Nav (5 tabs)                    Quick Actions
                        ↓                                       ↓
        ┌───────┬───────┼───────┬────────┐          ┌──────────┴──────────┐
        ↓       ↓       ↓       ↓        ↓          ↓                     ↓
      Home  Calendar Goals Analytics Settings  Add Expense         Budget Prediction
        ↓                                                          Group Expenses
   (default)
```

## Screen Dimensions
- **Width**: 393px
- **Height**: 852px
- **Safe area**: Accounted for in padding
- **Bottom nav height**: ~80px
- **Status bar height**: ~60px

## How to Navigate in the App

1. **Automatic flow**: Splash → Auth → Onboarding
2. **Bottom navigation**: Switch between main 5 tabs
3. **Back button**: Return to previous screen
4. **FAB (Floating Action Button)**: Quick add expense from home
5. **Cards**: Tap cards to navigate to detail screens

## Technical Stack
- React + TypeScript
- Tailwind CSS
- Recharts (for data visualization)
- Lucide React (for icons)
- Pure frontend (no backend required)

## Mock Data
All screens use realistic mock data to demonstrate functionality:
- Sample transactions
- Budget predictions
- Savings goals
- Pending payments
- Spending patterns

---

**Note**: This is a frontend prototype. All data is mock/local state. No real financial transactions or data storage occurs.
