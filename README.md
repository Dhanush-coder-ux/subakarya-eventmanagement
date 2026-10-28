# SOIRÉE — Premium Event Services Marketplace (Frontend Only)

A responsive, editorial-style event services marketplace web application built with React, TypeScript, Vite, and Tailwind CSS. The platform connects customers with verified event professionals (wedding planners, cinematic photographers, venues, caterers, makeup artists, decorators, and equipment rentals) featuring discovery feeds, high-definition reels, hashtag searches, dynamic profile completeness tracking, and structured booking chat with precalculated itemized quotations.

---

## 🎨 Design System & Theme

Built strictly according to the specified luxury editorial visual direction:

- **Wine Red**: `#7F011F` (Primary actions, active pills, badges, accents)
- **Light Sand**: `#F5EBD0` (Banners, ribbons, subtle card backgrounds)
- **Deep Wine**: `#650019` (Hover states, elevated elements)
- **Dark Text / Charcoal**: `#282326` (Readable, high-contrast typography)
- **Muted Text**: `#77716D` (Secondary labels, metadata)
- **Surface**: `#FFFCF6` (Warm white editorial card backgrounds)
- **Border**: `#E6DCCB` (Subtle borders, clean separation)
- **Success**: Accessible muted green (`#2D6A4F`)
- **Error**: Accessible dark red (`#8B1E1E`)
- **Typography**: Inter for clean legible body text + Cormorant Garamond for luxury serif display headings.
- **Icons**: Lucide React icons used consistently across every screen.

---

## 🚀 Key Features & Flow

### 1. Minimalist Authentication & Account-Type Selection
- **First Screen (`/login`)**: Professional sign-in screen with email/password validation, show/hide password toggle, remember me, forgot password helper, and instant one-click demo login buttons.
- **Account-Type Choice (`/account-type`)**: Two cards distinguishing **Customer** and **Professional / Vendor** experiences.
- **Seamless Role Switching**: Switch between Customer and Professional views anytime via the profile dropdown or Settings page without data loss.

### 2. Dynamic Professional Onboarding Wizard (`/onboarding/professional`)
- 6-step guided wizard:
  1. Personal Information (15%)
  2. Business Information (20%)
  3. Services & Pricing Packages (20%)
  4. Business Verification / Simulated KYC (15%)
  5. Portfolio & Project Showcase (20%)
  6. Availability & Review (10%)
- Live recalculation of completeness percentage based on completed required fields.
- Clear simulation disclaimers: PAN and KYC verification are simulated locally.

### 3. Customer Discovery & Search (`/` and `/search`)
- **Discovery Feed**: Curated posts, verified vendor badges, category quick-filters, nearby services (Madurai, Chennai, Coimbatore, Bengaluru).
- **Search & Hashtag Engine**: Case-insensitive partial matching across vendors, categories, event types, and hashtags (e.g., `#WeddingPhotography`, `#MaduraiCatering`, `#BridalMakeup`, `#BirthdayDecoration`).
- **Filter Bar**: Category filters, location filters, price sliders, and tabs for All, Professionals, Posts, Reels, and Services.

### 4. Dedicated Vertical Reels Player (`/reels`)
- Desktop: Centered vertical media viewer with keyboard navigation (`Up`/`Down` arrows, `Space` to play/pause).
- Mobile: Viewport-aware layout with overlay controls.
- Displays professional details, category badge, audio track, caption, hashtags, like & save counters, and instant **Book Now** action.

### 5. Structured Booking Through Chat (`/chat`)
- **Context Preservation**: Clicking "Book Now" on any post, reel, service, or vendor profile opens a conversation with that exact vendor and pre-populates the customer's demo ID and selected package.
- **Booking Request Card**: Interactive form within the conversation capturing event type, date, location, guest count, budget range, and special instructions.
- **Automated Quotation Card**:
  - Vendors generate draft quotations based on pre-configured service pricing formulas (fixed package, per person catering, per day rentals, etc.).
  - Invoice-style breakdown showing line items, unit rates, quantities, subtotal, discount, and total in INR.
  - Customers can **Accept Quote** (which automatically marks the booking as **Confirmed** and displays an acceptance message) or **Decline Quote**.

### 6. Vendor Dashboard, Inventory & Content Management
- **Dashboard (`/dashboard`)**: KPI metrics (Followers, Posts, Works, New Enquiries, Pending Quotations, Confirmed Bookings), completeness bar, and low-stock alerts.
- **Services & Pricing (`/services`)**: Full CRUD management of service packages, pricing models (`fixed`, `per_person`, `per_day`, `per_hour`, `per_item`, `custom`), and active status toggles.
- **Inventory Management (`/inventory`)**: Tracks reusable assets (cameras, sound systems, banquet chairs) and consumables (fresh flowers, album raw stock). Enforces zero-negative-stock validation on event allocations.
- **Portfolio & Works (`/portfolio`)**: Create posts, vertical reels, and project case studies.
- **Bookings Management (`/bookings`)**: Role-specific dashboard tracking Pending, Quotes Received, Confirmed, and Completed reservations.

### 7. Settings & Data Reset (`/settings`)
- Instant persona switcher between sample customers (Priya Sharma, Rohan Mehta, Ananya Reddy) and sample vendors (Lumière Studios, Aria Grand Palace, Saffron Royal Feast, etc.).
- **Reset Demo Data**: One-click restore button that purges localStorage and restores the pristine initial seed dataset.

---

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS with custom editorial brand tokens
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: Zustand with localStorage persistence
- **Validation**: Typed schemas & strict quantity validation

---

## 📦 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```
