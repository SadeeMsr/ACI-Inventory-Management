# Inventory Management System

A modern inventory management system built with Next.js, Apollo GraphQL, and TypeScript. Features real-time updates, drag-and-drop functionality, and barcode scanning capabilities.

## Architecture

### Frontend (Next.js App Router)
- Built with Next.js 14 and TypeScript
- Apollo Client for GraphQL state management
- Tailwind CSS for styling
- Component-based architecture with React
- Dark mode support
- Responsive design

### Backend (GraphQL API)
- Apollo Server
- MongoDB database
- JWT authentication
- Real-time updates
- RESTful principles through GraphQL

## Features

### 1. Authentication
- JWT-based authentication
- Protected routes
- Persistent sessions
- Secure password handling

### 2. Kanban Board
- Drag-and-drop interface
- Real-time status updates
- Filtering and search capabilities
- Responsive grid layout

### 3. Analytics Dashboard
- Product statistics
- Category distribution
- Trend analysis
- Interactive charts
- Real-time updates

### 4. Barcode Scanner
- Real-time scanning
- Mobile device camera support
- Quick product lookup
- Add products via barcode

### 5. Category Management
- CRUD operations
- Real-time updates
- Category statistics
- Bulk operations

## Installation

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Frontend Setup
-cd client
-npm run dev
-npm run dev

### Backend Setup
- cd server
- npm install
- npm run dev

## Key Packages and Their Purpose

### Frontend
1. **@apollo/client** (v3.12.2)
   - GraphQL client
   - State management
   - Caching capabilities

2. **@hello-pangea/dnd** (v17.0.0)
   - Drag-and-drop functionality
   - Kanban board implementation
   - Touch device support

3. **@zxing/library** (v0.21.3)
   - Barcode scanning capabilities
   - Multiple format support
   - Real-time detection

4. **recharts** (v2.14.1)
   - Interactive charts
   - Analytics visualization
   - Responsive design

5. **react-hook-form** (v7.54.0)
   - Form handling
   - Validation
   - Performance optimization

### Backend
1. **apollo-server-express**
   - GraphQL server
   - API endpoint handling
   - Subscription support

2. **mongoose**
   - MongoDB ODM
   - Schema management
   - Query building

3. **jsonwebtoken**
   - Authentication
   - Token management
   - Security

## API Structure

### GraphQL Queries
- `GET_PRODUCTS`: Fetch all products with filtering
- `GET_ANALYTICS`: Fetch dashboard analytics
- `GET_CATEGORIES`: Fetch available categories

### GraphQL Mutations
- `UPDATE_PRODUCT_STATUS`: Update product status
- `UPDATE_PRODUCT_CATEGORY`: Update product category
- `CREATE_PRODUCT`: Add new product
- `DELETE_PRODUCT`: Remove product

## Development

### Environment Variables
Create `.env.local` in client directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

Create `.env` in server directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/inventory
JWT_SECRET=your_jwt_secret
```

### Scripts
Frontend:
- `npm run dev`: Development server
- `npm run build`: Production build
- `npm run lint`: Run ESLint

Backend:
- `npm run dev`: Development server
- `npm run build`: Compile TypeScript
- `npm start`: Production server

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License
MIT License

## Authors
[Md Sadee Rohan]