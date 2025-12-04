# CBMC Website - Full Stack Application

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API Server
- **MongoDB** + **Mongoose** - Database
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

### Frontend
[![Netlify Status](https://api.netlify.com/api/v1/badges/b97dea89-3c05-4404-90e6-913d05455eef/deploy-status)](https://app.netlify.com/projects/cbmcapp/deploys)
- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Framer Motion** - Animations
- **React Icons** - Icons

---

## 📁 Project Structure

```
cbmc-website/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Event.js              # Event schema
│   │   ├── Gallery.js            # Gallery schema
│   │   ├── Testimonial.js        # Testimonial schema
│   │   ├── Membership.js         # Membership schema
│   │   └── Announcement.js       # Announcement schema
│   ├── routes/
│   │   ├── events.js             # Events API endpoints
│   │   ├── gallery.js            # Gallery API endpoints
│   │   ├── testimonials.js       # Testimonials API endpoints
│   │   ├── memberships.js        # Memberships API endpoints
│   │   └── announcements.js      # Announcements API endpoints
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Express server
│   └── seedData.js               # Database seed script
│
└── frontend/
    ├── public/                   # Static files
    ├── src/
    │   ├── components/           # React components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Events.jsx
    │   │   ├── Gallery.jsx
    │   │   ├── Testimonials.jsx
    │   │   └── MembershipForm.jsx
    │   ├── pages/
    │   │   ├── Home.jsx          # Main page
    │   │   └── AdminPanel.jsx    # Admin dashboard
    │   ├── services/
    │   │   └── api.js            # API service functions
    │   ├── App.jsx               # Main App component
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Global styles
    ├── index.html
    ├── package.json              # Frontend dependencies
    ├── vite.config.js            # Vite configuration
    ├── tailwind.config.js        # Tailwind configuration
    └── postcss.config.js         # PostCSS configuration
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone and Install

```bash
# Navigate to the project directory
cd cbmc-website

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB: https://www.mongodb.com/docs/manual/installation/
2. Start MongoDB service:
   ```bash
   # On macOS
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create free account: https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster (free tier available)
3. Get connection string from "Connect" button
4. Whitelist your IP address (0.0.0.0/0 for development)
5. Create database user with password

### Step 3: Environment Variables

Create `.env` file in `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/cbmc-website

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cbmc-website

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# CORS Origin
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Seed Database (Optional but Recommended)

```bash
cd backend
npm run seed
```

This will populate your database with sample data:
- 3 sample events
- 3 gallery categories with images
- 3 testimonials
- 1 announcement

### Step 5: Run the Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev        # Development mode with nodemon
# OR
npm start          # Production mode
```

Backend will run on: **http://localhost:5000**

#### Terminal 2 - Frontend React App
```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🎯 API Endpoints

### Events
```
GET    /api/events           # Get all events
GET    /api/events/:id       # Get single event
POST   /api/events           # Create event
PUT    /api/events/:id       # Update event
DELETE /api/events/:id       # Delete event
```

### Gallery
```
GET    /api/gallery          # Get all categories
GET    /api/gallery/:id      # Get single category
POST   /api/gallery          # Create category
PUT    /api/gallery/:id      # Update category
DELETE /api/gallery/:id      # Delete category
POST   /api/gallery/:id/images  # Add image to category
```

### Testimonials
```
GET    /api/testimonials     # Get all testimonials
GET    /api/testimonials/:id # Get single testimonial
POST   /api/testimonials     # Create testimonial
PUT    /api/testimonials/:id # Update testimonial
DELETE /api/testimonials/:id # Delete testimonial
```

### Memberships
```
GET    /api/memberships      # Get all applications
GET    /api/memberships/:id  # Get single application
POST   /api/memberships      # Submit application
PUT    /api/memberships/:id  # Update application
DELETE /api/memberships/:id  # Delete application
```

### Announcements
```
GET    /api/announcements    # Get current announcement
GET    /api/announcements/all  # Get all announcements
POST   /api/announcements    # Create announcement
PUT    /api/announcements/:id  # Update announcement
DELETE /api/announcements/:id  # Delete announcement
```

---

## 📝 Usage Guide

### For Visitors
1. **Homepage** - View welcome message and call-to-action
2. **Events Section** - Browse upcoming meditation sessions and programs
3. **Gallery** - View photos organized by categories
4. **Testimonials** - Read community member experiences
5. **Membership Form** - Submit membership application

### For Admins
1. Navigate to `/admin` or click "Admin" in navigation
2. Manage all content through the admin panel:
   - Add/Edit/Delete Events
   - Manage Gallery Categories and Images
   - Review and Manage Testimonials
   - View Membership Applications
   - Update Site Announcements

---

## 🔧 Development

### Backend Development
```bash
cd backend

# Run with auto-restart
npm run dev

# Run production mode
npm start

# Reseed database
npm run seed
```

### Frontend Development
```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deployment

### Backend Deployment (Heroku, Railway, Render)

1. **Heroku Example**:
```bash
# Install Heroku CLI
heroku login
heroku create cbmc-api

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-atlas-url
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

2. **Environment Variables** needed:
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV
   - CORS_ORIGIN (your frontend URL)

### Frontend Deployment (Vercel, Netlify)

1. **Vercel Example**:
```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel

# Set environment variable
# VITE_API_URL=https://your-backend-url.com/api
```

2. **Netlify Example**:
```bash
cd frontend
npm run build



# Upload 'dist' folder to Netlify
# Or connect GitHub repository
```

---

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  saffron: {
    DEFAULT: '#FF9933',  // Change this
    light: '#FFB366',
  },
  maroon: {
    DEFAULT: '#800020',  // Change this
    deep: '#5C0015',
  },
  // ... more colors
}
```

### Logo
Replace the ☸ symbol in `Navbar.jsx` with your logo image.

### Fonts
Edit Google Fonts link in `frontend/index.html` and update `tailwind.config.js`.

---

## 🔒 Security Notes

⚠️ **IMPORTANT** ⚠️

Current setup is for **DEVELOPMENT ONLY**. For production:

1. **Add Authentication**:
   - Implement JWT authentication
   - Protect admin routes
   - Add user login system

2. **Update API Routes**:
   - Add authentication middleware
   - Implement role-based access control
   - Validate all inputs

3. **Environment Variables**:
   - Never commit `.env` file
   - Use strong JWT secret
   - Restrict CORS origins

4. **Database**:
   - Set up proper indexes
   - Implement rate limiting
   - Add input sanitization

5. **Frontend**:
   - Implement protected routes
   - Add user authentication UI
   - Validate all form inputs

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**:
```
✓ Check MongoDB is running (local) or connection string is correct (Atlas)
✓ Verify network access in MongoDB Atlas
✓ Check database user credentials
```

**Port Already in Use**:
```bash
# Find process using port 5000
lsof -i :5000          # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
```

### Frontend Issues

**API Calls Failing**:
```
✓ Ensure backend is running on port 5000
✓ Check CORS settings in backend
✓ Verify API_URL in frontend
```

**Build Errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review API endpoints

---

**Happy Coding! 🙏**
