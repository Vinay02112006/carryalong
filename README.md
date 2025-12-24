# CarryAlong - Peer-to-Peer Parcel Delivery Platform

A full-stack web application that connects travelers with people who need to send parcels, enabling peer-to-peer parcel delivery along travel routes.

## 🚀 Tech Stack

### Frontend
- React.js 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- Context API for state management

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Bcrypt for password hashing
- Mock escrow payment system

## 📁 Project Structure

```
PARCEL/
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Helper functions
│   │   └── server.js      # Entry point
│   ├── .env.example       # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios configuration
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React Context
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Helper functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── package.json
└── README.md
```

## 🎯 Core Features

### 1. Authentication
- User registration with email, phone, and government ID
- JWT-based login
- Protected routes
- User profile management

### 2. Parcel Module
- Create parcel delivery requests
- View sent parcels
- Track parcel status (requested → accepted → picked_up → delivered → completed)
- Search parcels by cities
- Safety rules: max ₹10,000, blocked keywords (drugs, weapons, alcohol)

### 3. Travel Module
- Post travel routes (from/to cities, date, time)
- Specify vehicle type and available space
- View active travel posts
- Search routes by cities

### 4. Matching System
- Automatic matching of parcels with travel routes
- Based on pickup/drop cities and parcel size compatibility
- Travelers can accept matching parcels

### 5. Payment System (Mock Escrow)
- Funds held when parcel is accepted
- Released to traveler upon completion
- Track earnings

### 6. Rating System
- Senders can rate travelers (1-5 stars)
- Average rating calculation
- Review system

### 7. Chat (REST-based)
- Message between sender and traveler
- Conversation history per parcel

### 8. UI/UX
- Light & Dark theme toggle
- Mobile-first responsive design
- Bottom navigation for mobile
- Clean, modern interface

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/carryalong
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
FRONTEND_URL=http://localhost:5173
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `GET /api/auth/users/:id` - Get user by ID (protected)

### Parcels
- `POST /api/parcels` - Create parcel request
- `GET /api/parcels` - Get all available parcels
- `GET /api/parcels/search` - Search parcels
- `GET /api/parcels/my/sent` - Get my sent parcels
- `GET /api/parcels/my/carrying` - Get parcels I'm carrying
- `GET /api/parcels/:id` - Get parcel details
- `POST /api/parcels/:id/accept` - Accept parcel (traveler)
- `PUT /api/parcels/:id/status` - Update parcel status
- `GET /api/parcels/:id/matches` - Find matching travel routes
- `DELETE /api/parcels/:id` - Delete parcel

### Travel
- `POST /api/travel` - Create travel post
- `GET /api/travel` - Get all active travels
- `GET /api/travel/search` - Search travel routes
- `GET /api/travel/my/posts` - Get my travel posts
- `GET /api/travel/:id` - Get travel details
- `PUT /api/travel/:id/status` - Update travel status
- `GET /api/travel/:id/matches` - Find matching parcels
- `DELETE /api/travel/:id` - Delete travel post

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/parcel/:parcelId` - Get messages for parcel
- `PUT /api/messages/:id/read` - Mark message as read

### Ratings
- `POST /api/ratings` - Create rating
- `GET /api/ratings/traveler/:travelerId` - Get traveler ratings
- `GET /api/ratings/parcel/:parcelId` - Get rating by parcel

### Payments
- `GET /api/payments/parcel/:parcelId` - Get payment by parcel
- `GET /api/payments/my/earnings` - Get my earnings
- `GET /api/payments/my/sent` - Get my sent payments

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- Blocked keywords for prohibited items
- Max parcel value limit (₹10,000)

## 📱 Pages

1. **Login** - User authentication
2. **Register** - New user signup
3. **Dashboard** - Overview of parcels and travels
4. **Send Parcel** - Create new parcel request
5. **Post Travel** - Create new travel route
6. **Parcels** - List all parcels (sent/carrying/all)
7. **Parcel Details** - View and manage parcel
8. **Profile** - User profile and earnings

## 🎨 UI Features

- **Theme Toggle** - Switch between light and dark mode
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Bottom Navigation** - Easy mobile navigation
- **Status Badges** - Visual status indicators
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages

## 🚦 Parcel Status Flow

```
requested → accepted → picked_up → delivered → completed
```

- **requested**: Parcel created by sender
- **accepted**: Traveler accepts parcel (payment held)
- **picked_up**: Traveler confirms pickup
- **delivered**: Traveler confirms delivery
- **completed**: Sender confirms receipt (payment released)

## 💡 Usage Example

### As a Sender:
1. Register/Login
2. Click "Send Parcel"
3. Fill in pickup/drop cities, description, reward
4. Wait for traveler to accept
5. Track status and chat with traveler
6. Confirm delivery and rate traveler

### As a Traveler:
1. Register/Login
2. Click "Post Travel"
3. Fill in route details
4. View matching parcels
5. Accept parcels along your route
6. Update status as you progress
7. Receive payment upon completion

## 📝 Notes

- This is a portfolio/educational project
- Payment system is mock (no real transactions)
- Google Maps integration is optional/mock
- No actual verification of government IDs

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use.

## 📄 License

ISC

---

**Built with ❤️ for final year project / portfolio**
