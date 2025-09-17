# Resume Builder

A modern, full-stack resume builder with live preview, AI assistance, and multiple export formats.

## Features

- 🎨 **Live Preview** - Real-time resume preview as you type
- 🎯 **AI Assistance** - AI-powered content suggestions and improvements
- 📄 **Multiple Templates** - Professional resume templates
- 🎨 **Customizable Styling** - Fonts, colors, and spacing controls
- 📤 **Multiple Export Formats** - PDF, DOCX, HTML
- 🔐 **User Authentication** - Secure user accounts with Firebase
- 💾 **Cloud Storage** - Save and sync resumes across devices
- 🔗 **Public Sharing** - Share resumes with public links
- 💳 **Monetization** - Free tier with watermarks, paid tier without

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Firebase Auth** for authentication
- **Firestore** for data storage

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **Firebase Admin SDK** for server-side operations
- **Puppeteer** for PDF generation
- **OpenAI API** for AI assistance
- **Stripe** for payments
- **Cloudinary** for image storage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- OpenAI API key
- Stripe account (for payments)
- Cloudinary account (for images)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd resume-builder
   ```

2. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**

   Frontend (`.env`):

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

   Backend (`.env`):

   ```env
   PORT=3001
   NODE_ENV=development

   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com

   OPENAI_API_KEY=sk-your_openai_api_key

   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   FRONTEND_URL=http://localhost:3000
   ```

5. **Set up Firebase**

   - Create a Firebase project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Deploy the Firestore rules from `infra/firestore.rules`
   - Generate a service account key for the backend

6. **Start the development servers**

   **Option 1: Use the provided scripts (Recommended)**

   - Windows: Double-click `start-dev.bat`
   - Mac/Linux: Run `chmod +x start-dev.sh && ./start-dev.sh`

   **Option 2: Manual start**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

## Project Structure

```
resume-builder/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth, Resume)
│   │   ├── templates/       # Resume templates
│   │   ├── lib/            # Utilities and Firebase config
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (PDF, AI, etc.)
│   │   ├── middleware/     # Express middleware
│   │   ├── config/         # Configuration files
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
├── infra/                  # Infrastructure configuration
│   └── firestore.rules    # Firestore security rules
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/verify-token` - Verify Firebase ID token

### Resumes

- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### Export

- `POST /api/export/pdf` - Export resume to PDF
- `POST /api/export/docx` - Export resume to DOCX
- `POST /api/export/html` - Export resume to HTML

### AI

- `POST /api/ai/suggest` - Get AI suggestions
- `GET /api/ai/prompt-types` - Get available prompt types

### Payments

- `POST /api/payments/checkout/session` - Create Stripe checkout session
- `POST /api/payments/webhooks/stripe` - Stripe webhook handler

### Public

- `GET /public/:slug` - View public resume

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript
npm start           # Start production server
npm run lint        # Run ESLint
```

### Database Setup

1. Create a Firestore database in your Firebase project
2. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Deployment

### Frontend (Vercel/Netlify)

1. Connect your repository to Vercel or Netlify
2. Set environment variables
3. Deploy

### Backend (Render/Railway/Heroku)

1. Connect your repository
2. Set environment variables
3. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] More resume templates
- [ ] Advanced AI features (ATS optimization, LinkedIn import)
- [ ] Collaboration features
- [ ] Resume analytics
- [ ] Template marketplace
- [ ] Mobile app
- [ ] Multi-language support
