# 🛒 A to Z Cart — Full-Stack E-Commerce Platform

> A complete, production-ready e-commerce web application built with React.js, Node.js, Express, and MongoDB. Features glassmorphism UI, dark mode, real-time chat, payment gateways, loyalty system, and much more.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Application Workflow](#-application-workflow)
- [API Endpoints](#-api-endpoints)
- [Frontend Pages](#-frontend-pages)
- [UI/UX Features](#-uiux-features)
- [Payment Integration](#-payment-integration)
- [Real-Time Features](#-real-time-features)
- [Deployment](#-deployment)

---

## ✨ Features

### 🛍️ Shopping
- 10 product categories with 50+ real products
- Advanced search, filter by category, sort by price/rating
- Product detail page with image zoom, reviews, related products
- Shopping cart with quantity management (persisted in localStorage)
- Wishlist — save products for later
- Compare products side-by-side

### 👤 User System
- Email/password registration with OTP verification
- Google OAuth login
- JWT-based authentication
- Profile management with avatar upload
- Multiple delivery addresses
- Recently viewed products & stock alert subscriptions

### 💳 Checkout & Payments
- 4-step checkout: Address → Savings → Payment → Confirm
- **Stripe** (international cards)
- **Razorpay** (UPI, netbanking, cards — Indian)
- **Cash on Delivery**
- Coupon codes (% or flat discount)
- Wallet balance deduction
- Loyalty points redemption

### 💰 Loyalty & Rewards
- **Wallet** — Top up, spend, transaction history
- **Loyalty Points** — Earn on every order (₹1 = 0.1 pts), redeem at checkout
- **Referral System** — Unique code, both referrer and referred get ₹50 on first order

### 📦 Order Management
- Order tracking with status timeline
- Order confirmation + shipping emails
- Reorder with one click
- Returns & refunds portal (wallet auto-credited on approval)

### 🔴 Admin Dashboard
- Revenue charts (monthly)
- Manage products (CRUD + bulk import)
- Manage orders — update status
- Manage users, coupons, flash sales, banners
- Live chat support panel

### 💬 Real-Time Live Chat
- Floating chat widget for users
- Socket.io powered — instant message delivery
- Admin can reply from dashboard
- Unread message badge indicator

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Redux Toolkit | Global state (auth, cart) |
| React Router v6 | Client-side routing |
| Vite | Build tool |
| Socket.io Client | Real-time chat |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| Recharts | Admin charts |
| @stripe/react-stripe-js | Stripe checkout |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| Socket.io | Real-time communication |
| Stripe | Payment processing |
| Razorpay | Indian payment gateway |
| Cloudinary | Image upload & CDN |
| Nodemailer | Transactional emails |
| Bcryptjs | Password hashing |
| Multer | File upload middleware |

---

## 📁 Project Structure

```
atoz-cart-v2/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js            # Cloudinary setup
│   ├── controllers/
│   │   ├── auth.controller.js       # Register, login, OTP, Google OAuth
│   │   ├── product.controller.js    # Products CRUD, reviews, recommendations
│   │   ├── order.controller.js      # Orders, stats, reorder
│   │   ├── user.controller.js       # Profile, addresses, wishlist
│   │   ├── payment.controller.js    # Stripe + Razorpay
│   │   ├── coupon.controller.js     # Coupon validate & manage
│   │   ├── wallet.controller.js     # Wallet balance & transactions
│   │   ├── loyalty.controller.js    # Points earn & redeem
│   │   ├── referral.controller.js   # Referral code & rewards
│   │   ├── return.controller.js     # Return requests & refunds
│   │   ├── banner.controller.js     # Banners & flash sales
│   │   └── chat.controller.js       # Live chat messages
│   ├── middleware/
│   │   ├── auth.middleware.js        # protect, adminOnly
│   │   └── error.middleware.js       # Global error handler
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Product.js               # Product + reviews schema
│   │   ├── Order.js                 # Order schema
│   │   ├── Category.js              # Category schema
│   │   ├── Coupon.js                # Coupon schema
│   │   ├── Wallet.js                # Wallet + transactions
│   │   ├── Loyalty.js               # Loyalty points
│   │   ├── Referral.js              # Referral codes
│   │   ├── Return.js                # Return requests
│   │   ├── Banner.js                # Banners & flash sales
│   │   └── Chat.js                  # Chat messages
│   ├── routes/
│   │   └── *.routes.js              # Express routers (12 files)
│   ├── utils/
│   │   ├── generateToken.js         # JWT generator
│   │   ├── sendEmail.js             # Nodemailer helper
│   │   └── apiFeatures.js           # Search, filter, paginate helper
│   ├── server.js                    # Entry point + Socket.io setup
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx           # Sticky glassmorphism navbar + dark mode
    │   │   ├── Footer.jsx           # Footer with links
    │   │   ├── ProductCard.jsx      # Card with zoom, wishlist, cart button
    │   │   ├── ProtectedRoute.jsx   # Auth guard component
    │   │   ├── LiveChat.jsx         # Floating real-time chat widget
    │   │   └── FlashSaleBanner.jsx  # Countdown timer flash sale banner
    │   ├── data/
    │   │   └── catalog.js           # 10 categories + 50 products (static data)
    │   ├── hooks/
    │   │   ├── useDarkMode.js       # Dark/light mode with localStorage
    │   │   └── useScrollReveal.js   # Scroll-triggered reveal animations
    │   ├── pages/
    │   │   ├── Home.jsx             # Landing page (hero, banners, deals)
    │   │   ├── Products.jsx         # Product listing + sidebar filters
    │   │   ├── ProductDetail.jsx    # Product detail + image zoom
    │   │   ├── Cart.jsx             # Shopping cart
    │   │   ├── Checkout.jsx         # 4-step checkout flow
    │   │   ├── Login.jsx            # Login with glassmorphism UI
    │   │   ├── Register.jsx         # Registration with password strength
    │   │   ├── ForgotPassword.jsx   # Email → Token → New Password flow
    │   │   ├── Orders.jsx           # My orders with status tracking
    │   │   ├── Profile.jsx          # User profile + multiple addresses
    │   │   ├── Wishlist.jsx         # Saved / wishlisted products
    │   │   ├── WalletPage.jsx       # Wallet balance + transaction history
    │   │   ├── LoyaltyPage.jsx      # Points balance + earn history
    │   │   ├── ReferralPage.jsx     # Referral code + share + earnings
    │   │   ├── ReturnsPage.jsx      # Submit & track return requests
    │   │   ├── ComparePage.jsx      # Side-by-side product comparison
    │   │   └── AdminDashboard.jsx   # Full admin panel
    │   ├── redux/
    │   │   ├── store.js             # Redux store configuration
    │   │   ├── authSlice.js         # Auth state (login, register, loadUser)
    │   │   ├── cartSlice.js         # Cart state (add, remove, update, total)
    │   │   └── productSlice.js      # Product fetch state
    │   ├── utils/
    │   │   └── api.js               # Axios instance with JWT interceptor
    │   ├── App.jsx                  # All routes definition
    │   ├── main.jsx                 # React + Redux entry point
    │   └── index.css                # Global CSS + CSS variables + animations
    ├── package.json
    ├── vite.config.js
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local) or MongoDB Atlas (cloud, free)
- **npm** or **yarn**

### Step 1 — Extract the project
```bash
unzip atoz-cart-v3-complete.zip
cd atoz-cart-v2
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)
npm run dev
# Server starts at http://localhost:5000
```

### Step 3 — Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
# App opens at http://localhost:5173
```

---

## 🔑 Environment Variables

### `backend/.env`
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/atoz-cart

# JWT Secret (any long random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Cloudinary — https://cloudinary.com (free account)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe — https://stripe.com (test keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Razorpay — https://razorpay.com (test keys)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_SECRET=your_razorpay_key_secret

# Email (Gmail App Password recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_16_char_app_password

# App Config
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

---

## 🔄 Application Workflow

### 1. User Registration
```
Fill form → POST /api/auth/register
→ OTP emailed → Enter OTP → Account verified
→ JWT token issued → Logged in → Redirect to Home
```

### 2. Shopping Flow
```
Browse Products (filter/search/sort)
→ Click product → Product Detail page
→ Add to Cart (Redux state + localStorage)
→ Go to Checkout:
   Step 1: Choose/add delivery address
   Step 2: Apply coupon + use wallet + redeem loyalty points
   Step 3: Choose payment method (COD / Razorpay / Stripe)
   Step 4: Order confirmed → email sent → loyalty points earned
```

### 3. Order Lifecycle
```
Placed → Processing → Shipped → Out for Delivery → Delivered
(Admin updates status from dashboard → email sent at each step)
```

### 4. Return & Refund Flow
```
User: My Orders → Request Return → Fill reason
→ Admin reviews in dashboard → Approves or Rejects
→ On Approval: Refund auto-credited to Wallet → Email notification
```

### 5. Loyalty Points Flow
```
Place order (₹500) → Earn 50 points (0.1x rate)
→ At checkout: 50 points = ₹50 off (1:1 rate)
→ Points expire: never
→ View history on /loyalty page
```

### 6. Referral Flow
```
User A: Go to /referral → Copy unique link/code
→ Share with friend
→ User B: Register with code → Place first order
→ Both User A & User B: Get ₹50 wallet credit automatically
```

### 7. Live Chat Flow
```
User: Click chat widget (bottom right) → Type message → Send
→ Socket.io emits message to admin room instantly
→ Admin: See in /admin dashboard → Click user → Reply
→ User: Sees reply in real-time in chat widget
→ Unread badge shows count until opened
```

### 8. Forgot Password Flow
```
Login page → Click "Forgot Password?"
→ Step 1: Enter email → Click "Send Reset Link"
→ Email received with token link
→ Step 2: Paste token + Enter new password + Confirm
→ Click "Reset Password" → Success → Redirect to Login
```

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Register + send OTP email |
| POST | `/verify-otp` | Verify OTP code |
| POST | `/resend-otp` | Resend OTP |
| POST | `/login` | Login, returns JWT |
| POST | `/google` | Google OAuth login |
| POST | `/forgot-password` | Send password reset email |
| PUT | `/reset-password/:token` | Reset with token |
| GET | `/me` | Get logged-in user |

### Products — `/api/products`
| Method | Route | Description |
|---|---|---|
| GET | `/` | List (search, filter, sort, paginate) |
| GET | `/:id` | Single product detail |
| GET | `/featured` | Featured products |
| GET | `/recommended` | Personalized recommendations |
| GET | `/recently-viewed` | User's recently viewed |
| POST | `/compare` | Compare multiple products |
| POST | `/` | Create product (Admin) |
| PUT | `/:id` | Update product (Admin) |
| DELETE | `/:id` | Delete product (Admin) |
| POST | `/:id/reviews` | Add a review |
| POST | `/bulk-import` | Bulk import CSV (Admin) |

### Orders — `/api/orders`
| Method | Route | Description |
|---|---|---|
| POST | `/` | Create order |
| GET | `/my` | My orders list |
| GET | `/:id` | Single order detail |
| GET | `/admin/all` | All orders (Admin) |
| PUT | `/:id/status` | Update order status (Admin) |
| PUT | `/:id/pay` | Mark as paid |
| POST | `/:id/reorder` | Reorder same items |
| GET | `/admin/stats` | Revenue & chart data (Admin) |

### Payments — `/api/payments`
| Method | Route | Description |
|---|---|---|
| POST | `/stripe/intent` | Create Stripe PaymentIntent |
| POST | `/stripe/webhook` | Stripe webhook handler |
| POST | `/razorpay/order` | Create Razorpay order |
| POST | `/razorpay/verify` | Verify Razorpay signature |

### Other APIs
| Base Path | Description |
|---|---|
| `/api/users` | Profile update, avatar, password, addresses, wishlist |
| `/api/coupons` | Validate coupon, CRUD (Admin) |
| `/api/wallet` | Get balance, credit/debit |
| `/api/loyalty` | Points balance, earn, redeem, history |
| `/api/referral` | Get my code, process reward |
| `/api/returns` | Submit return, track, admin manage |
| `/api/banners` | Active banners, flash sale |
| `/api/chat` | User messages, admin reply |

---

## 📱 Frontend Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — Video hero, banners, categories, deals | ❌ Public |
| `/products` | Product listing with sidebar filters | ❌ Public |
| `/products/:id` | Product detail + image zoom + related | ❌ Public |
| `/cart` | Shopping cart | ❌ Public |
| `/compare` | Compare products table | ❌ Public |
| `/login` | Login (glassmorphism dark UI) | ❌ Public |
| `/register` | Registration + password strength | ❌ Public |
| `/forgot-password` | Forgot / Reset password (2-step) | ❌ Public |
| `/checkout` | 4-step checkout flow | ✅ Auth |
| `/orders` | My order history + tracking | ✅ Auth |
| `/profile` | Profile + multiple addresses | ✅ Auth |
| `/wishlist` | Saved / wishlisted products | ✅ Auth |
| `/wallet` | Wallet balance + history | ✅ Auth |
| `/loyalty` | Loyalty points + history | ✅ Auth |
| `/referral` | Refer & earn + share | ✅ Auth |
| `/returns` | Submit + track returns | ✅ Auth |
| `/admin` | Full admin dashboard | ✅ Admin |

---

## 🎨 UI/UX Features

### Design Language
- **Glassmorphism** — Frosted glass `backdrop-filter: blur` cards throughout
- **Dark Mode** — Full dark/light switch, persisted in localStorage, applied via `[data-theme="dark"]` CSS vars
- **Soft Rounded Corners** — Consistent 18px border radius system
- **Typography** — Google Font: Outfit (modern, clean, highly readable)
- **CSS Variables** — Easy theming with `--primary`, `--bg`, `--glass-bg` etc.

### Animation System
| Feature | How |
|---|---|
| Scroll Reveal | IntersectionObserver — `.reveal` class → fade + slide up |
| Skeleton Loading | CSS shimmer animation while data loads |
| Product Hover Zoom | CSS `transform: scale(1.09)` on `.pimg` |
| Button Click | Spring animation `scale(0.95)` on mousedown |
| Banner Slider | CSS opacity + scale transitions, auto-rotate 4s |
| Animated Blobs | CSS keyframe translate + scale on hero backgrounds |
| Video Background | `<video autoPlay muted loop>` in hero section |

### Product Card Features
- Image zoom on hover
- Discount badge (% off)
- Heart button for wishlist
- Out of stock overlay
- Star rating display
- Add to cart with animation
- Spring bounce on button click

---

## 💳 Payment Integration

### Stripe Flow
1. Checkout selects Stripe → `POST /api/payments/stripe/intent`
2. Backend creates `PaymentIntent`, returns `clientSecret`
3. Frontend renders Stripe Elements card form
4. User enters card → Stripe.js confirms payment
5. On success → create order → show confirmation

### Razorpay Flow
1. Checkout selects Razorpay → `POST /api/payments/razorpay/order`
2. Backend creates Razorpay order with amount
3. Frontend opens Razorpay checkout modal (UPI / Card / Netbanking)
4. On payment success → `POST /api/payments/razorpay/verify`
5. Backend verifies HMAC signature → create order → confirm

### Discount Application at Checkout (in order)
```
Original Amount
  → Apply Coupon  (% or flat, with min order & max cap)
  → Apply Wallet  (partial or full)
  → Apply Points  (1 point = ₹1, max 50% of order)
  = Final Amount to pay
```

---

## ⚡ Real-Time Features (Socket.io)

### Server Events
```
Server listens:
  join_user(userId)        — User joins their room
  join_admin()             — Admin joins admin room
  user_message({userId, text})  — User sends message
  admin_message({userId, text}) — Admin sends reply

Server emits:
  admin_reply({text, time})     — To user's room
  new_message({userId, text})   — To admin room
```

---

## 🌐 Deployment Guide

### Backend — Railway / Render / Heroku
```bash
# Set all env variables in platform dashboard
# Start command:
node server.js

# Or with package.json script:
npm start
```

### Frontend — Vercel / Netlify
```bash
# Build command:
npm run build

# Output directory:
dist

# Set environment variable:
VITE_API_URL=https://your-backend-url.com/api
```

### Database — MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Create database user + get connection string
3. Set `MONGO_URI` in backend `.env`
4. Whitelist `0.0.0.0/0` in Network Access (for deployment)

---

## 📦 10 Product Categories

| # | Category | Brands / Products |
|---|---|---|
| 1 | 📱 Mobiles | Apple, Samsung, OnePlus, Google, Xiaomi, Vivo, OPPO, Realme, Motorola, Nothing |
| 2 | 👗 Fashion | Men's blazer, Women's saree & kurta, Kids' jacket & dress |
| 3 | ⚽ Sports | Adidas football, Yonex badminton, SG cricket, Nike shoes, Yoga mat |
| 4 | 🏠 Home & Kitchen | Philips air fryer, Prestige cooker, Instant Pot, Godrej fridge |
| 5 | 📚 Books | Atomic Habits, Rich Dad Poor Dad, Harry Potter box set, NCERT |
| 6 | 🧸 Toys & Games | LEGO, RC Car, Barbie Dreamhouse, UNO card game |
| 7 | 🛒 Grocery | Tata Tea, Aashirvaad Atta, Amul Butter, Dabur Honey |
| 8 | 💪 Fitness | Adjustable dumbbells, Resistance bands, Treadmill, Whey protein |
| 9 | 💍 Jewellery | Tanishq gold, Diamond earrings, Silver bracelet, Titan watch |
| 10 | 🚗 Automotive | Garmin dash cam, Michelin inflator, Seat covers, OBD scanner |

---

## 🔐 Creating Admin Account

After setting up, register a normal account, then run in MongoDB shell:
```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 📄 License

For educational and portfolio use. Product names, brands and prices are for demonstration only.

---

**Built with ❤️ | A to Z Cart v3 | React + Node.js + MongoDB**
