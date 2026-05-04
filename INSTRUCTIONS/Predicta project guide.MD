# Predicta — Full-Stack AI-Powered Budget Management App
### Complete Project Documentation & Development Guide
> Course: Building an AI-Driven Full-Stack Application | Instructor: Yariv Gilad
> Compiled from Assignments 2, 3 & 4

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [User Personas](#2-user-personas)
3. [User Stories](#3-user-stories)
4. [Competitor Analysis](#4-competitor-analysis)
5. [Market Size](#5-market-size)
6. [Business Model](#6-business-model)
7. [Feature Prioritization — MoSCoW](#7-feature-prioritization--moscow)
8. [Tech Stack](#8-tech-stack)
9. [Screen Map (Site Map)](#9-screen-map-site-map)
10. [Data Flow Architecture](#10-data-flow-architecture)
11. [External Services](#11-external-services)
12. [Architecture Diagram Description](#12-architecture-diagram-description)
13. [Wireframes — Screen Breakdown](#13-wireframes--screen-breakdown)
14. [Navigation Flow](#14-navigation-flow)
15. [Hebrew Typography Rules (HEEBO + RTL)](#15-hebrew-typography-rules-heebo--rtl)
16. [Development Checklist](#16-development-checklist)

---

## 1. Project Overview

| Field | Details |
|---|---|
| **App Name** | Predicta |
| **Problem Statement** | There is a lack of tools for recording financial transactions (past and future) and analysing them using AI models with automatic intelligent categorisation. |
| **Solution** | A web application for fast, convenient documentation of financial transactions with embedded AI, enabling real-time dynamic budget management. |
| **Why this idea?** | A practical idea that directly addresses a concrete, daily problem — especially relevant to the Israeli market where banking apps fall short in smart classification and joint budget management. |

---

## 2. User Personas

### Primary Persona: Noa

| Field | Details |
|---|---|
| **Name & Age** | Noa, 32 |
| **Gender** | Female |
| **Location** | Tel Aviv |
| **Financial Background** | Stable monthly income; actively saving for an apartment purchase within the next year |
| **Occupation** | Project Manager at a tech company |
| **Tech Level** | High |
| **Motivations & Goals** | • Obtain an accurate financial picture for the near and long term<br>• Manage a shared budget with her partner<br>• View a 6-month cash-flow forecast (תזמ"ז) |
| **Frustrations & Pain Points** | • Inaccurate automatic categorisation in banking apps<br>• Inability to record future expenses not yet incurred<br>• Transaction delay in banking apps<br>• No joint bank account with partner |
| **Current Solution** | Maintains a shared Google Docs spreadsheet with her partner |

---

### Secondary Persona: Daniel

| Field | Details |
|---|---|
| **Name & Age** | Daniel, 24 |
| **Gender** | Male |
| **Location** | Beer Sheva |
| **Financial Background** | Low and unstable income; prioritises short-to-medium-term savings only |
| **Occupation** | Engineering student, works as a waiter |
| **Tech Level** | Medium |
| **Motivations & Goals** | • Save a fixed monthly amount for a trip in 6 months<br>• Manage a strict monthly budget while finding room for entertainment<br>• Identify available budget for savings allocation |
| **Frustrations & Pain Points** | • Difficulty with ongoing planning due to irregular income<br>• Hard to track daily expenses made via Bit (digital wallet) and then refunded — wrongly classified as expenses |
| **Current Solution** | Uses the phone's Notes app |

---

## 3. User Stories

User stories describe what the application needs to do from the user's perspective.  
Format: *"As [persona], I want to [action] so that [goal]."*

| # | As [Persona] | I want to... | So that... |
|---|---|---|---|
| 1 | Noa | Manage a shared budget with my partner inside the app | We can get a unified and accurate financial picture of all our expenses and income |
| 2 | Noa | Enter future expenses that have not yet been incurred | My financial forecast is accurate and includes all my future commitments |
| 3 | Noa | Correct inaccurate automatic expense categorisation | My expense categories correctly reflect my actual financial reality |
| 4 | Daniel | Mark an expense paid via Bit and later refunded as a "temporary expense" | It is not classified as a final expense and I can correctly track my available budget |
| 5 | Daniel | Receive analysis via an AI model | I can identify available budget to allocate toward savings for my trip |

---

## 4. Competitor Analysis

| Competitor | Type | Price | Strengths | Weaknesses | What's Missing |
|---|---|---|---|---|---|
| **Banking Apps** | Indirect | Included in bank fees | Direct connection to bank account, real-time data, high trust level | Transaction delay, inaccurate auto-categorisation, no joint account for couples | Ability to record future expenses; advanced AI-driven analysis |
| **YNAB (You Need A Budget)** | Direct | Monthly/annual subscription | Strong zero-based budgeting, forward planning | Rule-based (not AI), high commitment required, not adapted to the Israeli market (no Bit/Israeli bank connections) | AI-driven recommendations, self-correcting AI categorisation, full Israeli-market adaptation |
| **Google Docs** | Indirect | Free | Full flexibility, easy shared management, supports future expense documentation | Requires heavy manual work, human error, no automatic categorisation, no built-in AI analysis | No automatic bank connection, no AI recommendations, no fast-entry interface |

### Competitive Advantage of Predicta

Predicta's competitive advantage lies in **embedding AI at the core of the product** to solve Israeli users' pain points:

- **AI for Forecasting & Analysis:** Identifies available budget for savings and automatically corrects inaccurate expense categories.
- **Accurate Future Planning:** Enables users to document future expenses not yet incurred, ensuring a complete financial forecast.
- **Israel-Specific Solution:** Specifically handles temporary expenses and refunds (e.g. Bit payments) and supports joint budget management without requiring a joint bank account.

---

## 5. Market Size

| Metric | Description | Estimate |
|---|---|---|
| **TAM** (Total Addressable Market) | All adults in Israel with a bank account | 6,000,000 |
| **SAM** (Serviceable Addressable Market) | Young adults and couples actively managing a budget, or frustrated with existing tools | 1,500,000 |
| **SOM** (Serviceable Obtainable Market) | Realistic Year 1 target — 2% of SAM | 30,000 users |

---

## 6. Business Model

| Question | Answer |
|---|---|
| **Revenue Model** | **Free tier:** Core product — past transaction recording, basic auto-categorisation.<br>**Premium (subscription):** AI-powered features (budget analysis, future forecasting, category correction), advanced capabilities (joint budget management, Bit temporary expense handling). |
| **Paying users today** | 0 (not yet launched) |
| **Where to find the first 100 users** | Financial groups on social networks (primarily LinkedIn), where people share early-stage apps with exactly the right target audience. |

---

## 7. Feature Prioritization — MoSCoW

### Must Have *(without these the app does not function)*

- Basic user registration and login
- Fast manual entry of income and expenses (past transaction recording)
- Future expense entry — create financial transactions not yet incurred *(core of the solution)*
- Unified dashboard combining past data and future forecast (cash-flow / תזמ"ז)
- Basic automatic transaction categorisation by category

### Should Have *(important for UX, not critical for launch)*

- AI analysis and available-budget identification — savings recommendation based on irregular income
- Shared budget management — share and manage a budget with one partner
- Temporary expense marking — flag expenses as "temporary" (e.g. a Bit transaction expected to be refunded)
- Manual categorisation editing — correct inaccurate auto-classifications

### Could Have *(nice to add if time permits)*

- Automated email alerts when a projected budget overrun is detected
- Detailed graphs and reports for reviewing trends over time

### Won't Have *(not in v1 — possibly in the future)*

- Full automatic connection to all Israeli banks and credit cards (technically complex)
- Dedicated mobile app (focus is on web solution as defined)
- Credit and loan management tools (exclusive focus on management and forecasting)

---

## 8. Tech Stack

| Layer | Role | Technology |
|---|---|---|
| **Frontend** | Visual UI layer running in the browser | Vite + React |
| **Backend + DB** | Business logic, auth, data storage | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **Deploy** | Hosting and delivery | Vercel (Frontend) + Supabase Cloud (Backend) |
| **Source Control** | Version management | GitHub |
| **AI Agent** | Financial analysis and chat | Google Gemini API |
| **Email** | Notifications and OTP delivery | SendGrid |
| **File Storage** | Invoice/receipt uploads | Supabase Storage |

> **Important note from AI review:** Do NOT add Auth0 + Supabase Auth simultaneously — they overlap. Use **Supabase Auth only**. Similarly, do not use Firebase Storage alongside Supabase Storage. Stick to one provider per function to avoid duplication and unnecessary cost.

> **Rate limiting:** Add rate limiting on all Gemini API calls — every call costs money. Implement client-side debouncing and server-side limits via Supabase Edge Functions.

---

## 9. Screen Map (Site Map)

All screens are classified by access level: **Public**, **Authenticated (logged in)**, or **Admin**.

| # | Screen Name | Access Level | Short Description |
|---|---|---|---|
| 1 | **Home (Landing Page)** | Public | Landing screen showing basic app information with options to register or log in |
| 2 | **Register** | Public | Create a new user account with initial personal details (name, phone, email) |
| 3 | **Login** | Public | Authenticate via phone number + OTP code, or fixed password |
| 4 | **Forgot Password / Reset** | Public | Receive a verification code or reset link via SMS/email |
| 5 | **Dashboard (Homepage)** | Authenticated | Central view after login: cumulative chart of past transactions + 6-month cash-flow forecast |
| 6 | **New Expense / Income** | Authenticated | Manual entry or invoice scan to add a new financial transaction |
| 7 | **Reports** | Authenticated | Retrieve and view cash-flow reports filtered by user-selected time range |
| 8 | **AI Chat (PIP)** | Authenticated | Chat interface where the user asks questions about their financial data; AI responds based on history |
| 9 | **Search Transactions** | Authenticated | Filter and search expenses or income from the full transaction history |
| 10 | **Profile** | Authenticated | Edit and manage personal details, account information, and security settings |
| 11 | **Settings** | Authenticated | Manage app-wide settings: auto-categorisation rules, categories, notifications |
| 12 | **Admin Panel** | Admin | Manage users, monitor system logs, manage global system data |

---

## 10. Data Flow Architecture

The table below describes what happens at each layer for the 4 primary user actions:

| # | User Action | Frontend | Backend (Supabase) | Data Saved |
|---|---|---|---|---|
| 1 | **Registration** | User fills in their details in a form | User data is stored in the database (via Supabase Auth + users table) | First name, last name, phone, email |
| 2 | **Add / Delete Expense** | User fills in expense details or uploads an invoice | Database is updated or record is deleted accordingly | Date, expense type, amount, description text, invoice file |
| 3 | **Login** | User enters phone number and fills in OTP received on mobile | Supabase Auth validates OTP and returns session token | No personal data saved — session token only |
| 4 | **Search / Filter** | User selects filters (date range, type, category) | Query is executed against the transactions table and filtered results are returned | No new data saved — read-only query |

---

## 11. External Services

| Service | Used? | Provider / Tool | Notes |
|---|---|---|---|
| **Authentication** | Yes | Supabase Auth | OTP via phone (SMS) + optional password login |
| **File Storage** | Yes | Supabase Storage | Invoice and receipt uploads |
| **Payments** | No | — | Not in v1 |
| **Emails** | Yes | SendGrid | Transactional emails, OTP backup delivery |
| **AI Agent** | Yes | Google Gemini API | Financial chat + auto-categorisation |
| **OCR (Invoice Scan)** | Yes | Supabase Edge Function + Gemini Vision | Edge Function processes uploaded image and extracts transaction data |

---

## 12. Architecture Diagram Description

The architecture follows a clean 3-layer model:

```
┌─────────────────────────────────────────────┐
│              USER BROWSER                   │
│         Vite + React (Frontend)             │
│  Dashboard / Forms / Charts / AI Chat UI    │
└──────────────┬──────────────────────────────┘
               │  HTTPS / REST / Realtime WS
               ▼
┌─────────────────────────────────────────────┐
│              SUPABASE                       │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │  Auth       │  │  PostgreSQL DB       │  │
│  │  (OTP/Pass) │  │  users / transactions│  │
│  └─────────────┘  │  categories / budgets│  │
│  ┌─────────────┐  └──────────────────────┘  │
│  │  Storage    │  ┌──────────────────────┐  │
│  │  (Invoices) │  │  Edge Functions      │  │
│  └─────────────┘  │  OCR / AI / Rate Lim │  │
│                   └──────────────────────┘  │
└──────────────┬──────────────────────────────┘
               │  API Keys (server-side only)
               ▼
┌─────────────────────────────────────────────┐
│           EXTERNAL SERVICES                 │
│   Google Gemini API  │  SendGrid Email      │
└─────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│              VERCEL                         │
│         Frontend Deploy (CDN)               │
│         GitHub → Auto-deploy on push        │
└─────────────────────────────────────────────┘
```

**Key architectural decisions:**
- All Gemini API calls must go through **Supabase Edge Functions** — API keys must never be exposed in the frontend.
- Supabase Realtime can be used for live dashboard updates when a new transaction is added.
- Row Level Security (RLS) must be enabled on all Supabase tables so users can only access their own data.

---

## 13. Wireframes — Screen Breakdown

### Screen 1: Dashboard (Homepage)

| Field | Details |
|---|---|
| **Screen Purpose** | Central view after login providing an immediate financial overview of past actions and a future cash-flow forecast |
| **What does the user do here?** | Views cumulative data and charts of cash flow (תזמ"ז) — 3 months back, 3 months forward (adjustable) — to get a full financial picture |
| **UI Components** | • Cumulative chart of past transactions<br>• 6-month cash-flow forecast chart (תזמ"ז)<br>• Primary navigation menu with links to all app screens<br>• Quick-add FAB button (New Expense / Income) |
| **Where does each button lead?** | **Navigation buttons:** Dashboard, New Expense/Income, Reports, AI Chat, Search, Profile, Settings<br>**Clicking a chart/area:** Optional deep-link to Reports screen for detailed view |

---

### Screen 2: New Expense / Income

| Field | Details |
|---|---|
| **Screen Purpose** | Allow the user to enter a new financial transaction (expense or income) via manual input or by scanning an invoice |
| **What does the user do here?** | Selects transaction type (expense/income), enters details (amount, date, description), categorises it, and confirms. Alternatively scans an invoice to auto-fill details |
| **UI Components** | • Toggle/selector: Expense ↔ Income<br>• Amount input field<br>• Date input field<br>• Category selector (dropdown)<br>• Description text field<br>• "Scan Invoice" button (opens camera/file picker)<br>• "Temporary expense" checkbox<br>• Primary "Save Transaction" CTA button<br>• Primary navigation bar |
| **Where does each button lead?** | **Save Transaction:** Validates and saves → returns to Dashboard. Invalid data → shows inline error message<br>**Scan Invoice:** Opens camera/file interface → Gemini Vision extracts data → auto-fills form fields<br>**Navigation buttons:** Lead to all other app screens |

---

### Screen 3: Login

| Field | Details |
|---|---|
| **Screen Purpose** | Allow the user to authenticate using phone number + OTP code, or a fixed password |
| **What does the user do here?** | Enters authentication credentials (phone + OTP or password) and confirms login to proceed to the Dashboard |
| **UI Components** | • Back/Cancel button<br>• Phone number input field<br>• Password or OTP input field<br>• Primary "Login" CTA button<br>• "Forgot Password" link<br>• "Register" link<br>• "Sign in with Google" option |
| **Where does each button lead?** | **Login:** Validates credentials → Dashboard (success) or inline error (failure)<br>**Forgot Password:** → Forgot Password / Reset screen<br>**Register:** → Registration screen<br>**Back/Cancel:** → Home (landing page) |

---

### Screen 4: Search Transactions

| Field | Details |
|---|---|
| **Screen Purpose** | Filter and search expenses or income from the full financial transaction history |
| **What does the user do here?** | Enters search keywords or uses filters (date range, transaction type, category) to narrow the transaction history and find specific records |
| **UI Components** | • Free-text search field<br>• Date range picker / filter<br>• Transaction type selector (Expense / Income / Both)<br>• Category filter dropdown<br>• Results list area (cards or table rows)<br>• Primary navigation bar |
| **Where does each button lead?** | **Click on a result item:** Opens a detail card with full transaction details (view + edit mode)<br>**Back button:** Returns to previous screen (Dashboard)<br>**Navigation buttons:** Lead to Dashboard, New Expense/Income, Reports, AI Chat, Profile, Settings |

---

### Screen 5: AI Chat (PIP — Picture in Picture)

| Field | Details |
|---|---|
| **Screen Purpose** | Let the user ask any question about their financial data via a chat interface; the AI responds based on their full transaction history |
| **What does the user do here?** | Types a natural language question (e.g. "How much did I spend on food in the last 3 months?", "What is my available savings budget?") and receives an AI-generated answer |
| **UI Components** | • Chat message history display<br>• Text input field with Send button<br>• Suggested questions (chips/shortcuts)<br>• Loading/typing indicator while AI processes<br>• PIP toggle (minimize / expand overlay)<br>• Primary navigation bar |
| **Where does each button lead?** | **Send:** Sends query to Gemini API via Edge Function → returns AI response<br>**PIP Toggle:** Minimises chat to a floating icon or expands it full-screen<br>**Navigation buttons:** Lead to all other app screens |

---

## 14. Navigation Flow

The navigation follows a hub-and-spoke model with the **Dashboard** at the centre.

```
                    ┌─────────────┐
                    │ LANDING PAGE│  (Public)
                    └──────┬──────┘
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         ┌────────┐  ┌──────────┐  ┌──────────────┐
         │Register│  │  Login   │  │Forgot Password│
         └───┬────┘  └────┬─────┘  └──────┬───────┘
             └────────────┘               │
                     │                    │ (reset link)
                     ▼                    ▼
              ┌─────────────────────────────────┐
              │          DASHBOARD              │  ← Hub
              │  (Authenticated users only)     │
              └──┬──────┬──────┬──────┬─────┬──┘
                 │      │      │      │     │
          ┌──────┘  ┌───┘  ┌───┘  ┌──┘  ┌──┘
          ▼         ▼      ▼      ▼     ▼
    ┌──────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐
    │New Expns │ │Report│ │AI    │ │Search│ │Profile / │
    │/ Income  │ │  s   │ │Chat  │ │Trans.│ │Settings  │
    └──────────┘ └──────┘ └──────┘ └──┬───┘ └──────────┘
                                       │
                                       ▼
                                 ┌───────────┐
                                 │Transaction│
                                 │Detail Card│
                                 └───────────┘
```

**Decision points in the flow:**
- **Is the user authenticated?**
  - Yes → Dashboard
  - No → redirect to Login
- **Login success?**
  - Yes → Dashboard
  - No → inline error message, remain on Login screen
- **Save transaction success?**
  - Yes → Dashboard with success toast
  - No (validation error) → inline field error, remain on form
- **AI query result:**
  - Success → display AI message in chat
  - API error / rate limit → display friendly error message with retry option

---

## 15. Hebrew Typography Rules (HEEBO + RTL)

All Hebrew text in the application **must** follow these rules without exception:

### 15.1 — Font Import

Always import the Heebo font from Google Fonts. Add the following `<link>` tag inside your HTML `<head>`, **before** any other stylesheets:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### 15.2 — Global CSS for RTL + HEEBO

Apply the following global styles to your `index.css` or root stylesheet:

```css
/* ===== Global Hebrew / RTL Defaults ===== */
:root {
  --font-hebrew: 'Heebo', 'Arial Hebrew', Arial, sans-serif;
  --font-english: 'Inter', 'Segoe UI', Arial, sans-serif;
}

/* Apply RTL and Heebo to the entire app when language is Hebrew */
html[lang="he"],
[dir="rtl"] {
  direction: rtl;
  font-family: var(--font-hebrew);
  text-align: right;
}

/* Ensure all text elements inherit RTL */
[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3,
[dir="rtl"] h4,
[dir="rtl"] h5,
[dir="rtl"] h6,
[dir="rtl"] p,
[dir="rtl"] span,
[dir="rtl"] label,
[dir="rtl"] button,
[dir="rtl"] input,
[dir="rtl"] textarea {
  font-family: var(--font-hebrew);
  direction: rtl;
  text-align: right;
}

/* Form inputs in RTL */
[dir="rtl"] input,
[dir="rtl"] textarea,
[dir="rtl"] select {
  direction: rtl;
  text-align: right;
  padding-right: 12px;
  padding-left: 0;
}
```

### 15.3 — React / JSX Implementation

Set `dir="rtl"` and `lang="he"` on your root HTML element. In `index.html`:

```html
<html lang="he" dir="rtl">
```

In React components, explicitly declare direction on containers:

```jsx
// ✅ Correct — Hebrew container
<div dir="rtl" style={{ fontFamily: "'Heebo', Arial, sans-serif", textAlign: "right" }}>
  <p>שלום, נועה</p>
</div>

// ✅ Correct — mixed content (English numbers/labels inside Hebrew UI)
<div dir="rtl">
  <span style={{ direction: "rtl" }}>סה"כ הוצאות:</span>
  <span style={{ direction: "ltr", display: "inline-block" }}>₪1,234.50</span>
</div>
```

### 15.4 — Tailwind CSS RTL Utilities

If you use Tailwind CSS, enable RTL support in `tailwind.config.js`:

```javascript
module.exports = {
  // ...
  plugins: [
    require('@tailwindcss/typography'),
  ],
  // Use the `rtl:` variant prefix for RTL-specific overrides
}
```

Use `rtl:` prefix for directional utilities:

```jsx
// ✅ Correct Tailwind RTL classes
<div className="text-right rtl:pr-4 rtl:pl-0 ltr:pl-4 ltr:pr-0">
  <p className="font-['Heebo'] text-lg">טקסט בעברית</p>
</div>
```

### 15.5 — Font Weight Scale (HEEBO)

Use these weights consistently across the application:

| Weight | Value | Use Case |
|---|---|---|
| Light | `300` | Secondary labels, hints, captions |
| Regular | `400` | Body text, descriptions |
| Medium | `500` | Form labels, secondary headings |
| SemiBold | `600` | Card titles, section headings |
| Bold | `700` | Page headings (H2, H3) |
| ExtraBold | `800` | Hero text, main titles (H1) |

### 15.6 — Number & Currency Formatting

Financial values must always be displayed in LTR direction even within an RTL layout:

```jsx
// ✅ Correct — currency always LTR, isolated from RTL context
const formatCurrency = (amount) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(amount);

// In JSX:
<span dir="ltr" className="font-mono">{formatCurrency(1234)}</span>
// Output: ₪1,234
```

### 15.7 — RTL Layout Rules

| Rule | Do ✅ | Don't ❌ |
|---|---|---|
| Navigation sidebar | Right side of screen | Left side |
| Back arrow icon | Points **right** (→) in RTL | Never use ← as "back" in Hebrew UI |
| Form labels | Right-aligned, above input | Left-aligned or inside input |
| Flex row direction | `flex-row-reverse` or `dir="rtl"` | Plain `flex-row` for Hebrew content |
| Icon + text | Icon on the **left** of text (text on right side starts from right) | Mixing directions without explicit control |
| Date format | `DD/MM/YYYY` (Israeli standard) | `MM/DD/YYYY` (US format) |

### 15.8 — Preventing Common RTL Bugs

```css
/* Prevent icon mis-alignment in RTL */
[dir="rtl"] .icon-button {
  transform: scaleX(-1); /* Mirror directional icons like arrows */
}

/* Fix flexbox in RTL */
[dir="rtl"] .nav-bar {
  flex-direction: row-reverse;
}

/* Preserve LTR for specific elements even inside RTL context */
.preserve-ltr {
  direction: ltr;
  unicode-bidi: embed;
}
```

---

## 16. Development Checklist

### Assignment 2 — Research & Requirements ✅

- [x] Problem definition (one sentence)
- [x] Two complete user personas (primary + secondary)
- [x] 5 user stories
- [x] Competitor matrix (3+ competitors)
- [x] Market size estimate (TAM / SAM / SOM)
- [x] Initial business model
- [x] Completed MoSCoW feature table

### Assignment 3 — System Design ✅

- [x] Full screen map with access levels
- [x] Data flow table for 3–4 actions
- [x] External services list
- [x] Architecture diagram drawn
- [x] AI-validated architecture (duplicates removed: Auth0 replaced by Supabase Auth; Firebase Storage replaced by Supabase Storage)

### Assignment 4 — Wireframes ✅

- [x] Site map with access levels
- [x] Navigation flow diagram with labelled arrows and decision points (Eraser.io)
- [x] 3–4 wireframes of core screens (greyscale only — no colour, no fonts, no design)
- [x] Detail table per wireframe (purpose, UI components, navigation)
---

*Document compiled by: AI integration of Assignments 2, 3 & 4 — Predicta Project*  
*Course: Building an AI-Driven Full-Stack Application | Instructor: Yariv Gilad*