# 🏃‍♂️ Premium Tracksuits eCommerce Store

A modern, full-featured eCommerce website for selling high-quality branded tracksuits for Kids, Ladies, and Men. Built with Next.js, TypeScript, Tailwind CSS, and integrated with PayPal payments, Firebase Firestore, and email notifications.

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog**: Browse tracksuits by category (Kids, Ladies, Men)
- **Shopping Cart**: Add items with size selection and quantity management
- **Minimum Order**: Enforces 25-item minimum order requirement ($250 total)
- **PayPal Integration**: Secure payment processing
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### 💰 Pricing & Business Rules
- **Fixed Price**: $10 per tracksuit
- **Minimum Order**: 25 tracksuits ($250 total)
- **Free Shipping**: Included in all orders
- **Delivery**: 4-7 business days

### 👥 Referral System
- **Referral Codes**: Customers can create and share referral links
- **Earnings**: $100 commission for each completed referral order
- **Tracking**: Complete referral analytics and earnings tracking
- **Admin Dashboard**: Monitor referral performance and payouts

### 📧 Email Notifications
- **Customer Confirmation**: Order confirmation with details
- **Admin Notifications**: New order alerts with full customer information
- **Referral Tracking**: Notifications for referral earnings

### 🧑‍💼 Admin Dashboard
- **Order Management**: View all orders with customer details
- **Referral Analytics**: Track referral performance and earnings
- **Contact Messages**: Manage customer inquiries
- **Statistics**: Revenue, order count, and item statistics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Firebase project
- PayPal Business account
- Email service (Gmail or Resend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tracksuit-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   # PayPal Configuration
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

   # Email Configuration (Choose one)
   # Option 1: Gmail
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_APP_PASSWORD=your_gmail_app_password

   # Option 2: Resend
   RESEND_API_KEY=your_resend_api_key

   # Admin Configuration
   ADMIN_EMAIL=admin@yourdomain.com
   FROM_EMAIL=noreply@yourdomain.com
   ```

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Firestore Database
   - Set up Firestore security rules
   - Add your Firebase configuration to environment variables

5. **PayPal Setup**
   - Create a PayPal Business account
   - Get your Client ID from PayPal Developer Dashboard
   - Add to environment variables

6. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                          # Next.js 13+ App Router
│   ├── admin/                    # Admin dashboard pages
│   │   ├── login/               # Admin login
│   │   ├── messages/            # Contact messages
│   │   ├── orders/              # Order management
│   │   └── referrals/           # Referral analytics
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin API endpoints
│   │   ├── create-referral/     # Referral creation
│   │   └── submit-order/        # Order submission
│   └── page.tsx                 # Main store page
├── components/                   # React components
│   ├── ui/                      # Shadcn/ui components
│   ├── tracksuit-store.tsx      # Main store component
│   ├── referral-creator.tsx     # Referral system
│   └── PayPalButton.tsx         # PayPal integration
├── lib/                         # Utility libraries
│   ├── firebase.ts              # Firebase configuration
│   ├── firestore.ts             # Firestore operations
│   ├── email.ts                 # Email notifications
│   └── tracksuit-data.ts        # Product data
├── types/                       # TypeScript type definitions
│   └── form.ts                  # Form and data types
└── public/                      # Static assets
    └── images/                  # Product images
```

## 🛍️ Product Management

### Adding Products
Edit `lib/tracksuit-data.ts` to add new products:

```typescript
{
  id: 'unique-id',
  name: 'Product Name',
  category: 'kids' | 'ladies' | 'mens',
  image: 'image-filename.jpg',
  description: 'Product description',
  price: 10,
  sizes: ['XS', 'S', 'M', 'L', 'XL']
}
```

### Product Images
- Place product images in `public/images/`
- Use descriptive filenames (e.g., `kids-sport-1.jpg`)
- Recommended size: 800x800px
- Format: JPG or PNG

## 🔧 Configuration

### Admin Access
- Default admin password is set in the login component
- Change the password in `app/admin/login/page.tsx`
- Admin session is stored in sessionStorage

### Email Configuration
The system supports two email providers:

**Gmail (Recommended for development):**
```env
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

**Resend (Recommended for production):**
```env
RESEND_API_KEY=your_resend_api_key
```

### PayPal Configuration
1. Create a PayPal Business account
2. Get your Client ID from PayPal Developer Dashboard
3. Add to environment variables:
   ```env
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

## 📊 Database Schema

### Orders Collection
```typescript
{
  id: string,
  customerName: string,
  customerEmail: string,
  customerWhatsapp: string,
  deliveryAddress: string,
  cartItems: CartItem[],
  totalPrice: number,
  totalQuantity: number,
  paymentId?: string,
  referralCode?: string,
  referredBy?: string,
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

### Referrals Collection
```typescript
{
  referralCode: string,
  referrerEmail: string,
  referrerName: string,
  referredCustomers: string[],
  completedOrders: string[],
  totalEarnings: number,
  createdAt: Date
}
```

### Contacts Collection
```typescript
{
  name: string,
  email: string,
  message: string,
  createdAt: Date
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users (admin)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Environment Variables
- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly

## 📱 Mobile Responsiveness

The store is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎨 Customization

### Styling
- Uses Tailwind CSS for styling
- Custom colors and themes can be modified in `tailwind.config.ts`
- Component styling in individual component files

### Branding
- Update logo and branding in components
- Modify color scheme in Tailwind config
- Customize email templates in `lib/email.ts`

## 📞 Support

For support and questions:
- Check the Firebase setup guide in `FIREBASE_SETUP.md`
- Review the component documentation
- Check the admin dashboard for order management

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS** #   p r e m i u m - t r a c k s u i t s - s t o r e  
 