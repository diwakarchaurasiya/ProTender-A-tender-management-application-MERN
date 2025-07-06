# ProTender - B2B Tender Management Platform

A comprehensive B2B tender management web application built with React.js frontend and Express.js backend, powered by Supabase.

## Features

- **Company Profile Management**: Create and manage company profiles with industry details
- **Tender Management**: Create, edit, and browse tenders with full CRUD operations
- **Application System**: Apply to tenders and manage applications
- **Search Functionality**: Search companies by name, industry, or services
- **Authentication**: Secure JWT-based authentication
- **File Upload**: Company logo upload via Supabase storage
- **Responsive Design**: Modern, mobile-first design with plain CSS

## Tech Stack

### Frontend
- React.js (JavaScript)
- Plain CSS with Flexbox/Grid
- react-toastify for notifications
- lucide-react for icons
- Vite for build tooling

### Backend
- Express.js (JavaScript)
- JWT authentication
- bcrypt for password hashing
- Joi for input validation
- Supabase for database and storage

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations provided in the ARCHITECTURE.md
3. Set up a storage bucket named 'company-logos'
4. Configure RLS policies as described in ARCHITECTURE.md

## Project Structure

```
ProTender/
├── frontend/              # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS stylesheets
│   └── package.json
├── backend/               # Express.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── package.json
├── README.md
└── ARCHITECTURE.md
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.