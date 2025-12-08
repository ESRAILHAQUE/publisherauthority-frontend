# Publisher Authority - Frontend Application

A complete publisher platform website built with **Next.js 16 (App Router)** and **TypeScript**, where publishers can sign up, add their websites, receive orders for off-page SEO/guest posting, and manage payments. The website features a modern, clean, and professional design with a comprehensive dashboard system for users and a full admin panel.

## 🚀 Features

### ✅ **Public Pages**

- **Home Page**

  - Hero section explaining the platform for publishers
  - How it works (3-step system: Sign Up → Add Website → Receive Orders)
  - Benefits for publishers (earnings, high-quality clients, secure payments)
  - Features list
  - "Get started" CTA
  - Testimonials section
  - FAQ section
  - Footer with all links

- **Apply as Publisher Page**

  - Complete publisher application form
  - Requirements section
  - Quiz questions
  - "Submit Application" functionality

- **Support Page**

  - Expandable/collapsible FAQs
  - Contact form
  - Email support information

- **Blog Page**

  - SEO and digital marketing articles
  - Pagination
  - Featured images
  - Categories

- **Authentication**
  - Login page with Email/Password
  - Remember Me checkbox
  - Forgot Password functionality

### ✅ **User Dashboard System**

#### **1. Dashboard Home**

- Real-time stats cards:
  - Total Earnings (lifetime)
  - Pending Orders count
  - Ready To Post orders count
  - Orders Under Verification count
  - Completed Orders count
  - Active Websites count
- **Account Level Badge System:**
  - Silver Level (0-49 completed orders, 30 active websites)
  - Gold Level (50-149 completed orders, 100 active websites)
  - Premium Level (150-300 completed orders, 500 active websites)
  - Automatic level calculation and progress tracking
  - Visual progress bar to next level
- Recent orders display
- Upcoming deadlines

#### **2. Add Website Section**

- **Single Website Form:**

  - Website URL
  - Domain Authority (DA)
  - Monthly Organic Traffic (Ahrefs)
  - Website Niche/Category
  - Description
  - Backend API integration

- **Bulk Add Websites:**

  - CSV upload interface
  - Template download option

- **Website Verification System:**

  - **Method 1: HTML Tag Verification**
    - Verification code display
    - Instructions for adding meta tag to `<head>` section
    - One-click verification
  - **Method 2: Verification Article**
    - Verification link generation
    - Instructions for publishing verification article
    - One-click verification
  - Real-time verification status updates

- **Verification Status:**
  - Pending
  - Counter Offer
  - Active
  - Rejected
  - Deleted

#### **3. Orders Section**

- **Order Tabs:**
  - All Orders
  - Pending Orders
  - Ready To Post
  - Verifying
  - Completed Orders
- **Order Details Page:**
  - Complete order information
  - Order submission form (for ready-to-post orders)
  - Article URL submission
  - Notes field
  - Submission status tracking
- **Order Status Badges:**
  - Pending
  - Ready To Post
  - Verifying
  - Completed
  - Revision Requested
  - Cancelled
- Earnings display per order
- Deadline tracking

#### **4. Payment Section**

- **Payment Settings:**
  - PayPal email configuration
  - Save payment method
- **Payment Information:**
  - Payment schedule (1st and 15th of each month)
  - Currency information (USD)
  - Link monitoring policy
- **Invoice History:**
  - Invoice number
  - Description
  - Invoice date
  - Amount
  - Due date
  - Payment date
  - Status (Paid, Pending, Processing, Failed)
  - Download PDF option

#### **5. Profile Page**

- **Profile Information:**
  - First Name, Last Name
  - Email (read-only)
  - Country
  - **Profile Image Upload:**
    - Image upload functionality
    - Support for JPG, PNG, GIF
    - Max size 2MB
    - Real-time preview
- **Password Change:**
  - Current password
  - New password
  - Confirm password
- **Account Overview:**
  - Account level badge
  - Total orders completed
  - Total earnings
  - Active websites count
  - Member since date

### ✅ **Admin Panel**

#### **Admin Dashboard**

- **Stats Widgets:**
  - Total publishers
  - Total websites
  - Pending verifications
  - Total orders
  - Active orders
  - Total earnings
  - Payments queue
- Quick actions
- Recent activity feed

#### **Admin Features**

- **Manage Publishers**

  - View all publishers
  - Publisher details
  - Account level management (auto + manual update)

- **Website Management**

  - View all submitted websites
  - Website verification (HTML tag or Article method)
  - Approve/Reject websites
  - Send Counter Offer
  - Update website status
  - Filter by status

- **Order Management**

  - **Create New Order:**
    - Order title
    - Website selection
    - Publisher assignment
    - Deadline setting
    - Earnings amount
    - Description and requirements
    - Status selection
  - View all orders
  - Order details
  - Request revision
  - Cancel order
  - Complete order
  - Order status management

- **Payment Processing**

  - View payment queue
  - Process payments
  - Update payment status
  - Invoice management

- **Application Review**

  - View all applications
  - Approve/Reject applications
  - Application details

- **Blog Management**

  - View all blog posts
  - Add/Edit/Delete blog posts
  - Featured image upload
  - Categories management

- **Support Ticket Management**

  - View all tickets
  - Ticket status tracking
  - Respond to tickets

- **Platform Settings**
  - Logo upload
  - Color customization
  - Email settings

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom utility classes
- **State Management**: React Hooks
- **API Integration**: REST API with centralized API client
- **Authentication**: JWT token-based authentication
- **File Upload**: FormData API for image uploads
- **Build Tool**: Next.js built-in build system
- **Deployment**: PM2 + Nginx on VPS

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page
│   ├── apply/                    # Apply as publisher page
│   ├── auth/                     # Authentication pages
│   │   └── login/
│   ├── blog/                     # Blog listing page
│   ├── support/                  # Support/FAQ page
│   ├── dashboard/                # User dashboard
│   │   ├── page.tsx              # Dashboard home
│   │   ├── websites/            # Website management
│   │   │   ├── page.tsx         # My websites list
│   │   │   └── add/             # Add website page
│   │   ├── orders/              # Orders management
│   │   │   ├── page.tsx         # Orders list
│   │   │   └── [id]/            # Order detail page
│   │   ├── payments/            # Payment management
│   │   └── profile/             # Profile settings
│   └── admin/                    # Admin panel
│       ├── page.tsx              # Admin dashboard
│       ├── publishers/           # Publisher management
│       ├── websites/             # Website management
│       ├── orders/               # Order management
│       │   └── create/           # Create order page
│       ├── payments/             # Payment processing
│       ├── applications/         # Application review
│       ├── blog/                 # Blog CMS
│       ├── support/              # Support tickets
│       └── settings/             # Platform settings
├── components/                    # Reusable components
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── home/                     # Home page sections
│   ├── dashboard/                # Dashboard components
│   │   └── Sidebar.tsx
│   ├── admin/                    # Admin components
│   │   └── AdminSidebar.tsx
│   ├── websites/                 # Website components
│   │   └── WebsiteVerification.tsx
│   └── shared/                   # Shared UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       └── Select.tsx
├── lib/                          # Utility libraries
│   └── api.ts                    # API client functions
├── public/                       # Static assets
├── .github/                      # GitHub Actions
│   └── workflows/
│       └── deploy.yml            # Deployment workflow
└── README.md                     # This file
```

## 🔌 API Integration

The frontend uses a centralized API client located in `lib/api.ts` that provides:

- **Dashboard API**: Get dashboard stats, level progress, recent orders
- **Websites API**: Add, get, update, delete websites, verification
- **Orders API**: Get, create, update, submit, revision, cancel, complete orders
- **Payments API**: Get payments, invoices, update PayPal email
- **Profile API**: Get/update profile, change password, upload image
- **Auth API**: Login, register, logout, forgot password
- **Applications API**: Submit application, review applications
- **Admin API**: Admin dashboard, website management, order management, payments
- **Blog API**: Get, create, update, delete blog posts
- **Support API**: Create tickets, get tickets, update tickets

All API calls include:

- Automatic authentication token injection
- Error handling
- TypeScript types
- Consistent error messages

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Backend API server running

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Environment variables**

Create a `.env.local` file in the `frontend` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5003/api
```

For production:

```bash
NEXT_PUBLIC_API_URL=https://publisherauthority.com/api
```

3. **Run development server**

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create optimized production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint (if configured)

## 🎨 Design Features

- **Clean, Modern UI**: Professional design with consistent branding
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: CSS transitions and animations
- **High-Quality Icons**: SVG icons throughout
- **Color Scheme**: Purple (#3F207F) and Teal (#2EE6B7) brand colors
- **Typography**: Clear, readable fonts
- **Accessibility**: WCAG compliant where possible

## 🔐 Authentication

- JWT token-based authentication
- Tokens stored in localStorage
- Automatic token injection in API requests
- Protected routes for dashboard and admin pages
- Remember me functionality

## 📊 Account Level System

The platform automatically calculates and updates user account levels based on:

- **Silver**: 0-49 completed orders AND 30 active websites
- **Gold**: 50-149 completed orders AND 100 active websites
- **Premium**: 150-300 completed orders AND 500 active websites

Levels are calculated in real-time and displayed with progress bars.

## ✅ Website Verification

Two verification methods are available:

1. **HTML Tag Method**: Add verification meta tag to website's `<head>` section
2. **Article Method**: Publish a verification article with a specific link

Both methods are fully integrated with the backend verification system.

## 📦 Deployment

### GitHub Actions CI/CD

The project includes automated deployment via GitHub Actions:

- Automatic build on push to `main` branch
- Deploy to VPS via SCP
- PM2 restart after deployment
- See `.github/workflows/deploy.yml` for details

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. Copy files to VPS:

```bash
scp -r .next public package.json package-lock.json next.config.ts user@vps:/var/www/publisherauthority/frontend
```

3. On VPS:

```bash
cd /var/www/publisherauthority/frontend
npm install --production
pm2 restart publisherauthority-frontend
```

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (required)

### Next.js Configuration

- Image optimization enabled
- Remote image patterns configured
- TypeScript strict mode

## 📚 Key Features Implementation

### ✅ Completed Features

- ✅ All public pages (Home, Apply, Support, Blog, Login)
- ✅ Complete user dashboard with all sections
- ✅ Website verification system (HTML tag + Article methods)
- ✅ Account level system with auto-calculation
- ✅ Order management (Create, View, Submit, Track)
- ✅ Payment settings and invoice history
- ✅ Profile management with image upload
- ✅ Complete admin panel
- ✅ Admin order creation
- ✅ Backend API integration
- ✅ Responsive design
- ✅ Authentication system

### 🚧 Future Enhancements

- Blog CMS with rich text editor
- Support ticket system with email notifications
- Link monitoring automation
- Invoice PDF generation
- Enhanced form validation
- Real-time notifications

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**

   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Verify backend server is running
   - Check CORS settings on backend

2. **Authentication Issues**

   - Clear localStorage and try logging in again
   - Check token expiration
   - Verify backend auth endpoints

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors

## 📄 License

This project is a **client-specific, private codebase** and is not intended for public reuse or redistribution. All rights are reserved by the project owner.

## 👥 Support

For issues or questions, please contact the development team or refer to the backend API documentation.

---

**Built with ❤️ using Next.js 16 and TypeScript**

_Last updated: December 2025_