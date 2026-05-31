# PREDICTA - Database Schema & Data Structure

This document outlines the recommended data structure and database schema based on an analysis of the PREDICTA application's pages and features.

## 1. Users Table (`users`)
Stores core user details, authentication data, and subscription status.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the user |
| `first_name` | String | Not Null | User's first name |
| `last_name` | String | Not Null | User's last name |
| `email` | String | Unique, Not Null | Email address (used for login) |
| `phone` | String | Nullable | User's phone number |
| `password_hash` | String | Not Null | Hashed password |
| `avatar_url` | String | Nullable | URL to the user's profile picture |
| `plan_type` | Enum | Default 'free' | 'free' or 'premium' |
| `partner_id` | UUID | Foreign Key | Links to another `users.id` for shared budget (Premium) |
| `created_at` | Timestamp | Not Null | Account creation date |
| `updated_at` | Timestamp | Not Null | Last update timestamp |

## 2. User Settings Table (`user_settings`)
A 1-to-1 relationship with the `users` table to store preferences (found in SettingsPage).

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | Primary Key, FK (`users.id`) | Links to the user |
| `notif_budget` | Boolean | Default True | Notify on budget exceedance |
| `notif_summary` | Boolean | Default True | Weekly summary notifications |
| `notif_ai` | Boolean | Default False | AI insights notifications |
| `auto_category` | Boolean | Default True | AI auto-categorization enabled |
| `future_forecast` | Boolean | Default True | 6-month future forecasting enabled |
| `rtl_mode` | Boolean | Default True | Right-to-Left UI mode |
| `currency_code`| String | Default 'ILS' | Default currency (e.g., ILS) |
| `date_format` | String | Default 'DD/MM/YYYY' | Display format for dates |

## 3. Categories Table (`categories`)
Stores transaction categories. Can be pre-populated system defaults and custom user categories.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique category ID |
| `user_id` | UUID | FK (`users.id`), Nullable| Null means it's a global system default category |
| `name` | String | Not Null | e.g., 'אוכל', 'תחבורה', 'משכורת' |
| `type` | Enum | Not Null | 'expense', 'income', or 'both' |
| `color_hex` | String | Nullable | Hex code for UI representation (e.g. '#ff6b00') |
| `icon_name` | String | Nullable | Material symbols icon name |

## 4. Transactions Table (`transactions`)
The core table storing incomes, expenses, and future/temporary transactions.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique transaction ID |
| `user_id` | UUID | FK (`users.id`), Not Null| The user who owns this transaction |
| `amount` | Decimal | Not Null | Transaction amount |
| `type` | Enum | Not Null | 'expense' or 'income' |
| `currency` | String | Default 'ILS' | Currency of the transaction |
| `description` | String | Nullable | Manual or AI-extracted description |
| `date` | Date/Time | Not Null | Date the transaction occurred or will occur |
| `category_id` | UUID | FK (`categories.id`) | Link to category |
| `is_temporary` | Boolean | Default False | True if expected to be refunded (e.g. Bit) |
| `status` | Enum | Default 'completed' | 'completed' or 'future' (for future forecasts) |
| `receipt_url` | String | Nullable | URL to the scanned invoice/receipt |
| `created_at` | Timestamp | Not Null | When the record was created |

## 5. Budgets Table (`budgets`)
Stores monthly limits set by the user for specific categories.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique budget rule ID |
| `user_id` | UUID | FK (`users.id`), Not Null| User owning this budget |
| `category_id` | UUID | FK (`categories.id`), Not Null| Category being budgeted |
| `month` | Integer | Not Null | 1-12 |
| `year` | Integer | Not Null | e.g., 2025 |
| `amount_limit` | Decimal | Not Null | The cap set for this category this month |

## 6. AI Chat Messages Table (`chat_messages`)
Stores the history of the user's conversation with Predicta AI.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique message ID |
| `user_id` | UUID | FK (`users.id`), Not Null| The user chatting |
| `is_ai` | Boolean | Not Null | True if Predicta AI, False if user |
| `title` | String | Nullable | AI message title (e.g., 'זיהיתי דפוס הוצאה חריג 🔍') |
| `text` | Text | Not Null | The actual message content |
| `stats_payload`| JSON | Nullable | Structured data for AI charts/stats in the chat bubble |
| `action_label` | String | Nullable | Button text if AI suggests an action ('צפה בפירוט') |
| `created_at` | Timestamp | Not Null | Message timestamp |

---

## 🔗 Key Relationships & Logic Constraints

1. **Shared Premium Budgets (Partner Logic):**
   - If `users.partner_id` is populated, the app should aggregate `transactions` and `budgets` where `user_id IN (currentUser.id, currentUser.partner_id)`.
2. **Dashboard Analytics (Net Income & Spend):**
   - Sum of `transactions` where `type = 'income'` vs `type = 'expense'` filtered by current Month/Year.
   - Ignore transactions where `is_temporary = True` from final budget calculations.
3. **Future Forecasting:**
   - Queries `transactions` where `status = 'future'` combined with historical averages grouped by `category_id`.
4. **Reports:**
   - Uses aggregated views of `transactions` grouped by `category_id`, filtered by `date` ranges, joining the `categories.color_hex` for the pie/bar charts.
