# SpendWise 💰

SpendWise is an independently-architected, cross-platform personal finance application (React Native, Firebase) encompassing dynamic budgeting, algorithmic expense categorization, stateful savings goals, and real-time group-expense tracking — serving as his clearest example of solo, end-to-end full-stack ownership from ideation to a fully shipped production build.

Engineered with a focus on performance and robust state management, the application leverages a decoupled architecture featuring a reactive TypeScript frontend and a scalable Python/FastAPI backend. Key technical implementations include a bespoke regex-driven SMS parsing engine for automated transaction ingestion, predictive forecasting heuristics for proactive budget alerts, and high-performance SVG-based data visualizations (Recharts) to deliver a seamless, low-latency user experience.

## 🌟 Key Features

*   **Intelligent Auto-Categorization:** Automatically categorizes your expenses based on your spending patterns and merchant data.
*   **Automated SMS Parsing:** Automatically detects and extracts transactions from bank SMS notifications.
*   **Predictive Budget Alerts:** Proactive warnings that predict if you're on track to overspend by the end of the month based on your current pace.
*   **Beautiful Data Visualizations:** 
    *   Interactive Spending Calendar with color-coded daily health (Green/Yellow/Red).
    *   Monthly trends via bar and line charts.
    *   Category breakdowns using pie charts.
*   **Goals & Savings Tracking:** Set financial goals, track your progress, and get smart daily/weekly savings suggestions.
*   **Group & Pending Payments (FIFO):** Keep track of who owes you (and who you owe), ordered intelligently.
*   **Dark Mode Support:** A fully persistent, sleek dark mode theme optimized for mobile viewing.

## 🏗️ Architecture & Tech Stack

SpendWise uses a decoupled architecture with a cross-platform mobile frontend and a fast, scalable cloud backend.

### Frontend (Mobile App)
*   **Framework:** React Native (TypeScript) optimized for iOS & Android
*   **Styling:** Tailwind CSS & Glassmorphism design principles
*   **Navigation:** React Navigation (Bottom Tabs & Stack)
*   **Data Visualization:** Recharts, React Native Chart Kit, Gifted Charts
*   **State & Theming:** React Context API (Dark mode persistence)

### Backend (API Service)
*   **Framework:** Python with FastAPI
*   **Database:** Google Cloud Firestore (Firebase) for real-time document storage
*   **Core Engine:** Includes an intelligent SMS parser and a merchant classification engine to auto-tag transactions (`Food & Dining`, `Shopping`, `Transport`, etc.).

## 🔄 App Flow & Navigation Map

SpendWise is built around an intuitive 5-tab navigation system, starting with a streamlined onboarding process:

```text
Splash → Auth → Welcome → Categories → Budget Setup → Home Dashboard
```

**The 5 Main Tabs:**
1.  **🏠 Home Dashboard:** Your daily overview. Shows monthly spending progress, budget prediction alerts, recent transactions, and quick-add FAB.
2.  **📅 Spending Calendar:** A monthly view highlighting daily spending health. Includes interactive trend charts (Bar/Line) and day-by-day breakdowns.
3.  **🎯 Goals:** Track your savings goals with progress bars and receive actionable daily saving recommendations.
4.  **📊 Analytics:** Deep-dive into your spending. View category breakdowns, month-over-month comparisons, and top spending days.
5.  **⚙️ Settings:** Manage your profile, adjust budget preferences, toggle Dark Mode, and check data sync status.

## 🚀 Getting Started

### Prerequisites
*   Node.js and npm/yarn
*   Python 3.8+ (for backend)
*   React Native development environment set up (Android Studio/Xcode)
*   Firebase project configured

### 1. Start the Backend Server

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Run the Mobile App

Open a new terminal window at the project root:-

```bash
# Install dependencies
npm install

# Start the Metro bundler
npm start

# Run on iOS (requires Mac)
npm run ios

# Run on Android
npm run android
```

## 🎨 Design System
*   **Colors:** Deep Purple (`#9333ea`), Blue (`#3b82f6`), Success Green, Warning Yellow, Error Red.
*   **Theme:** Clean, modern fintech aesthetic utilizing card-based layouts, soft shadows, and a mobile-first 8pt grid system.
*   **Accessibility:** High contrast ratios maintained across both Light and Dark modes.

---
*Built with care for smart spenders 💜*
