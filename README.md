# Shoroot - Betting Platform

A modern, full-stack betting platform built with React and Node.js that allows users to create, participate in, and manage bets with a comprehensive admin panel.

## 🎯 Features

### User Features

-    **User Authentication**: Secure registration and login system
-    **Bet Participation**: Join open and active bets with credit system
-    **Real-time Dashboard**: View all available bets with status indicators
-    **Personal Profile**: Track your betting history and credits
-    **Multiple Bet Options**: Support for 2-5 betting options per bet

### Admin Features

-    **Bet Management**: Create, edit, delete, and resolve bets
-    **User Management**: Manage user accounts, roles, and credits
-    **Status Control**: Toggle bet statuses (open → active → in_progress → resolved)
-    **Credit System**: Reset user credits and manage financial aspects
-    **Bet Reversal**: Undo resolved bets and restore previous states

### Bet Status System

-    **Open**: New bets accepting initial participants
-    **Active**: Bets with 2+ participants, still accepting new players
-    **In Progress**: Admin-controlled state where no new participants allowed
-    **Resolved**: Completed bets with determined winners

## 🛠 Tech Stack

### Frontend

-    **React 18** with Vite for fast development
-    **React Router** for navigation
-    **Tailwind CSS** for styling
-    **Lucide React** for icons
-    **Date-fns** for date formatting

### Backend

-    **Node.js** with Express.js
-    **SQLite3** database
-    **JWT** authentication
-    **bcryptjs** for password hashing
-    **CORS** enabled

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

-    **Node.js** (version 16 or higher)
-    **npm** or **yarn** package manager
-    **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bolandsho
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup

The application uses default configurations, but you can customize:

**Backend Configuration** (server/index.js):

-    `PORT`: Default is 3001
-    `JWT_SECRET`: Change for production use
-    Database path: `server/betting.db`

### 4. Database Initialization

The SQLite database will be automatically created when you first run the server. It includes:

-    Automatic table creation
-    Schema migrations
-    Default admin user creation

**Default Admin Credentials:**

-    Email: `admin@betting.com`
-    Password: `admin123`

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend Server:**

```bash
cd server
node index.js
```

The backend will run on `http://localhost:3001`

2. **Start the Frontend (in a new terminal):**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Build

1. **Build the Frontend:**

```bash
npm run build
```

2. **Preview Production Build:**

```bash
npm run preview
```

## 🌐 Deployment Guide

### Option 1: Traditional VPS/Server Deployment

#### Prerequisites

-    Linux VPS/Server (Ubuntu 20.04+ recommended)
-    Node.js 16+ installed
-    PM2 process manager (recommended)
-    Nginx (for reverse proxy)

#### Steps

1. **Server Setup:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

2. **Deploy Application:**

```bash
# Clone repository
git clone <repository-url>
cd bolandsho

# Install dependencies
npm install
cd server && npm install && cd ..

# Build frontend
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'shoroot-backend',
    script: 'server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

3. **Configure Nginx:**

```bash
sudo nano /etc/nginx/sites-available/shoroot
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/bolandsho/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/shoroot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Docker Deployment

1. **Create Dockerfile:**

```dockerfile
# Frontend build stage
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Backend stage
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY server/package*.json ./server/
RUN cd server && npm install --production

COPY server/ ./server/
COPY --from=frontend-build /app/dist ./dist

EXPOSE 3001

CMD ["node", "server/index.js"]
```

2. **Create docker-compose.yml:**

```yaml
version: "3.8"
services:
     shoroot:
          build: .
          ports:
               - "3001:3001"
          volumes:
               - ./server/betting.db:/app/server/betting.db
          restart: unless-stopped
          environment:
               - NODE_ENV=production

     nginx:
          image: nginx:alpine
          ports:
               - "80:80"
          volumes:
               - ./nginx.conf:/etc/nginx/nginx.conf
          depends_on:
               - shoroot
          restart: unless-stopped
```

3. **Deploy:**

```bash
docker-compose up -d
```

### Option 3: Cloud Platform Deployment

#### Heroku

1. Install Heroku CLI
2. Create Heroku app
3. Add buildpacks for Node.js
4. Configure environment variables
5. Deploy with Git

#### Railway/Render

1. Connect GitHub repository
2. Configure build and start commands
3. Set environment variables
4. Deploy automatically

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory for production:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret-key
DB_PATH=./betting.db
```

### Security Considerations

-    Change default JWT secret in production
-    Use HTTPS in production
-    Implement rate limiting
-    Regular database backups
-    Monitor server resources

## 📱 API Documentation

### Authentication Endpoints

-    `POST /api/auth/login` - User login
-    `POST /api/auth/register` - User registration
-    `GET /api/auth/me` - Get current user

### Bet Endpoints

-    `GET /api/bets` - List all bets
-    `POST /api/bets` - Create bet (admin)
-    `PUT /api/bets/:id` - Update bet (admin)
-    `DELETE /api/bets/:id` - Delete bet (admin)
-    `PUT /api/bets/:id/status` - Change bet status (admin)
-    `PUT /api/bets/:id/resolve` - Resolve bet (admin)
-    `PUT /api/bets/:id/revert` - Revert resolved bet (admin)

### Participation Endpoints

-    `GET /api/participations` - List participations
-    `POST /api/participations` - Join a bet

### User Management Endpoints

-    `GET /api/users` - List users (admin)
-    `PUT /api/users/:id` - Update user (admin)
-    `PUT /api/users/reset-credits` - Reset all user credits (admin)

## 🧪 Testing

### Manual Testing

1. Register new users
2. Create bets as admin
3. Test bet participation flow
4. Verify status transitions
5. Test credit system

### Database Management

```bash
# Backup database
cp server/betting.db server/betting.db.backup

# Reset database (development only)
rm server/betting.db
# Restart server to recreate
```

## 🛠 Troubleshooting

### Common Issues

1. **Database Connection Error:**

     - Ensure SQLite3 is properly installed
     - Check file permissions in server directory

2. **CORS Issues:**

     - Verify frontend and backend URLs
     - Check CORS configuration in server/index.js

3. **Build Failures:**

     - Clear node_modules and reinstall
     - Check Node.js version compatibility

4. **PM2 Process Issues:**
     - Check logs: `pm2 logs`
     - Restart process: `pm2 restart shoroot-backend`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:

-    Create an issue in the repository
-    Check existing documentation
-    Review API endpoints and responses

---

**Shoroot** - Making betting fun and fair for everyone! 🎲
