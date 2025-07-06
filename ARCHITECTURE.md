# ProTender Architecture Documentation

## Overview

ProTender is a full-stack B2B tender management application with a React.js frontend and Express.js backend, using Supabase as the database and storage provider.

## Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT DEFAULT 'company',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### companies
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### tenders
```sql
CREATE TABLE tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    deadline DATE NOT NULL,
    budget DECIMAL(15,2),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### applications
```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
    applicant_company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    proposal TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### goods_services
```sql
CREATE TABLE goods_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /api/auth/register
- **Description**: Register a new user
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`

#### POST /api/auth/login
- **Description**: Login user
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`

#### GET /api/auth/me
- **Description**: Get current user info
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user, company }`

### Company Routes (`/api/companies`)

#### GET /api/companies
- **Description**: Get all companies (with pagination)
- **Query**: `?page=1&limit=10&search=<query>`
- **Response**: `{ companies, totalPages, currentPage }`

#### GET /api/companies/:id
- **Description**: Get company by ID
- **Response**: `{ company, goods_services }`

#### POST /api/companies
- **Description**: Create company profile
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name, industry, description }`
- **Response**: `{ company }`

#### PUT /api/companies/:id
- **Description**: Update company profile
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name, industry, description }`
- **Response**: `{ company }`

#### POST /api/companies/:id/logo
- **Description**: Upload company logo
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData with 'logo' file
- **Response**: `{ logoUrl }`

### Tender Routes (`/api/tenders`)

#### GET /api/tenders
- **Description**: Get all tenders (with pagination)
- **Query**: `?page=1&limit=10&search=<query>`
- **Response**: `{ tenders, totalPages, currentPage }`

#### GET /api/tenders/:id
- **Description**: Get tender by ID
- **Response**: `{ tender, company }`

#### POST /api/tenders
- **Description**: Create new tender
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, description, deadline, budget }`
- **Response**: `{ tender }`

#### PUT /api/tenders/:id
- **Description**: Update tender
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, description, deadline, budget }`
- **Response**: `{ tender }`

#### DELETE /api/tenders/:id
- **Description**: Delete tender
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message }`

#### GET /api/tenders/company/:companyId
- **Description**: Get tenders by company
- **Response**: `{ tenders }`

### Application Routes (`/api/applications`)

#### POST /api/applications
- **Description**: Apply to tender
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ tenderId, proposal }`
- **Response**: `{ application }`

#### GET /api/applications/tender/:tenderId
- **Description**: Get applications for tender
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ applications }`

#### GET /api/applications/company/:companyId
- **Description**: Get applications by company
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ applications }`

### Goods & Services Routes (`/api/goods-services`)

#### GET /api/goods-services/company/:companyId
- **Description**: Get goods/services by company
- **Response**: `{ goods_services }`

#### POST /api/goods-services
- **Description**: Add goods/services
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, description }`
- **Response**: `{ goods_service }`

## Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server validates credentials and returns JWT token
3. Client stores token in localStorage
4. Client includes token in Authorization header for protected routes
5. Server middleware validates token and attaches user to request object

## File Upload Flow

1. User selects logo file in frontend
2. File is uploaded to `/api/companies/:id/logo` endpoint
3. Backend validates file type and size
4. File is uploaded to Supabase storage bucket 'company-logos'
5. Public URL is returned and stored in companies table
6. Frontend updates UI with new logo URL

## Row Level Security (RLS) Policies

### companies table
```sql
-- Users can read all companies
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);

-- Users can insert their own company
CREATE POLICY "Users can insert their own company" ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own company
CREATE POLICY "Users can update their own company" ON companies FOR UPDATE USING (auth.uid() = user_id);
```

### tenders table
```sql
-- Tenders are viewable by everyone
CREATE POLICY "Tenders are viewable by everyone" ON tenders FOR SELECT USING (true);

-- Company owners can insert tenders
CREATE POLICY "Company owners can insert tenders" ON tenders FOR INSERT WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);

-- Company owners can update their own tenders
CREATE POLICY "Company owners can update their own tenders" ON tenders FOR UPDATE USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
```

### applications table
```sql
-- Applications are viewable by tender owner and applicant
CREATE POLICY "Applications viewable by relevant parties" ON applications FOR SELECT USING (
    applicant_company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()) OR
    tender_id IN (SELECT id FROM tenders WHERE company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()))
);

-- Companies can insert applications
CREATE POLICY "Companies can insert applications" ON applications FOR INSERT WITH CHECK (
    applicant_company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
```

## Error Handling

The application implements comprehensive error handling:

1. **Input Validation**: Joi schemas validate all input data
2. **Authentication Errors**: 401 for invalid/missing tokens
3. **Authorization Errors**: 403 for insufficient permissions
4. **Not Found Errors**: 404 for non-existent resources
5. **Server Errors**: 500 for unexpected server issues

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Security**: Tokens have expiration times
3. **Input Sanitization**: All inputs are validated and sanitized
4. **File Upload Security**: File types and sizes are validated
5. **SQL Injection Prevention**: Parameterized queries are used
6. **CORS**: Configured for frontend domain only

## Performance Optimizations

1. **Pagination**: All list endpoints support pagination
2. **Indexing**: Database indexes on frequently queried columns
3. **Caching**: Static assets are cached
4. **Compression**: Response compression enabled
5. **Image Optimization**: Uploaded images are optimized

## Deployment Considerations

1. **Environment Variables**: All sensitive data in environment variables
2. **SSL/TLS**: HTTPS enforced in production
3. **Database Backups**: Regular automated backups
4. **Monitoring**: Application and database monitoring
5. **Logging**: Comprehensive logging for debugging