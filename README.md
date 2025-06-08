# Delightful Encounters

A full-stack web application with a modern SvelteKit frontend, Node.js/Express backend, and Java Swing desktop client.

## 🌐 Live Website
Visit our live application at: [delightfulencounters.com](https://delightfulencounters.com)

## 🏗️ Project Architecture

This project consists of three main components:

- **Frontend**: SvelteKit application with modern UI
- **Backend**: Node.js/Express API server with SQLite database
- **Desktop Client**: Java Swing application for desktop users

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Python** (version 3.7 or higher)
- **SQLite** (version 3.0 or higher)
- **Java Development Kit (JDK)** (version 8 or higher) - for the desktop client
- **Git** (for cloning the repository)

## 🚀 Quick Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/delightfulencounters.git
cd delightfulencounters/Delightful-Encounters-main
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create environment configuration:

```bash
# Copy the example environment file
cp env.example .env

# Edit .env file with your configuration (optional for development)
# The default values should work for local development
```

Start the backend server:

```bash
# For development (with auto-reload)
npm run dev

# For production
npm start
```

The backend will run on `http://localhost:3000` by default.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

### 4. Java Swing Client Setup (Optional)

If you want to use the desktop client:

1. Open the `java-swing-client` directory in your Java IDE (IntelliJ IDEA, Eclipse, etc.)
2. Ensure your project is configured to use JDK 8 or higher
3. Build and run the application from your IDE

## 🔧 Configuration

### Backend Configuration

The backend uses environment variables for configuration. Key variables include:

- `PORT`: Server port (default: 3000)
- `FRONTEND_ORIGIN`: Frontend URL for CORS (default: http://localhost:5173)
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `DB_FILENAME`: SQLite database file path
- `NODE_ENV`: Environment (development/production)

### Database

The application uses SQLite for data storage. The database is automatically initialized when the backend starts for the first time.

## 🛠️ Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run format` - Format code with Prettier

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting
- `npm run format` - Format code

## 🚀 Production Deployment

### Building for Production

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set production environment variables** in the backend `.env` file:
   ```
   NODE_ENV=production
   JWT_SECRET=your-secure-production-secret
   FRONTEND_ORIGIN=https://delightfulencounters.com
   ```

3. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

### Deployment Options

- **Frontend**: Can be deployed to static hosting services (Netlify, Vercel, GitHub Pages)
- **Backend**: Can be deployed to cloud platforms (Heroku, Railway, DigitalOcean, AWS)
- **Database**: SQLite file can be hosted alongside the backend, or migrate to PostgreSQL/MySQL for production

## 🔒 Security Notes

- Change the `JWT_SECRET` in production
- Use HTTPS in production
- Configure proper CORS origins
- Implement rate limiting for production use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in `.env` file
2. **CORS errors**: Ensure FRONTEND_ORIGIN matches your frontend URL
3. **Database issues**: Delete the database file and restart the backend to reinitialize
4. **Node modules issues**: Delete `node_modules` and run `npm install` again

### Getting Help

If you encounter any issues:
1. Check the console logs for error messages
2. Ensure all prerequisites are installed
3. Verify that both frontend and backend servers are running
4. Check that environment variables are properly configured

---

For more detailed information about specific components, check the individual directories and their documentation.