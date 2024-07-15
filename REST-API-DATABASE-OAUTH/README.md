# Skeleton project for Swagger
# Project NODE JS-REACTJS-MYSQL-OAUTH IMPLEMENTATION

## Project Overview

This project is a full-stack web application developed using Node.js, Express, MySQL, and React.js. It includes OAuth authentication using Passport.js with Google and GitHub strategies. The backend server handles API requests and interacts with a MySQL database, while the frontend is built using React.js.

## Table of Contents

1. [Installation](#installation)
2. [Project Structure](#project-structure)
3. [Database Setup](#database-setup)
4. [OAuth Configuration](#oauth-configuration)
5. [Running the Application](#running-the-application)
6. [API Endpoints](#api-endpoints)
7. [Special Instructions](#special-instructions)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YashM150/REST-API-DATABASE-OAuth.git
   cd REST-API-DATABASE-OAuth
   ```

2. **Install backend dependencies:**

   ```bash
   npm install passport passport-google-oauth20 passport-github2
   npm install myssql2
   npm install concurrently --save -dev
   npm install express
   npm init
   
   ```

3. **Install frontend dependencies:**

   ```bash
   cd my-app
   npm install axios
   ```

## Project Structure

```plaintext
├── config
│   ├── db.js
│   └── passport.js
├── controllers
│   └── userController.js
├── middleware
│   └── authMiddlewares.js
├── models
│   └── userModels.js
├── my-app (React app)
│   ├── public
│   ├── src
│   └── ...
├── node_modules
├── routes
│   └── userRoutes.js
├── .env
├── .gitattributes
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

## Database Setup

1. **Create the MySQL database:**

   ```sql
   CREATE DATABASE oauth;
   USE oauth;
   ```

2. **Create the tables:**

   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       google_id VARCHAR(255) DEFAULT NULL,
       github_id VARCHAR(255) DEFAULT NULL,
       email VARCHAR(255) NOT NULL,
       access_token TEXT NOT NULL,
       refresh_token TEXT DEFAULT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE demo (
       user_id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       bloodgroup VARCHAR(255),
       gender VARCHAR(10)
   );
   ```

## OAuth Configuration

1. **Create a `.env` file in the root directory and add your OAuth credentials:**

   ```plaintext
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   SESSION_SECRET=your-session-secret
   DB_HOST=your-database-host
   DB_USER=your-database-username
   DB_PASSWORD=your-database-password
   DB_NAME=oauth
   ```

2. **Configure Passport strategies in `config/passport.js`:**

   ```javascript
   const passport = require('passport');
   const GoogleStrategy = require('passport-google-oauth20').Strategy;
   const GitHubStrategy = require('passport-github2').Strategy;
   const { pool } = require('./db');

   // Serialize and deserialize user
   passport.serializeUser((user, done) => {
     done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
     pool.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
       done(error, results[0]);
     });
   });

   // Google Strategy
   passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
     callbackURL: '/auth/google/callback'
   }, (accessToken, refreshToken, profile, done) => {
     // Handle Google OAuth logic here
   }));

   // GitHub Strategy
   passport.use(new GitHubStrategy({
     clientID: process.env.GITHUB_CLIENT_ID,
     clientSecret: process.env.GITHUB_CLIENT_SECRET,
     callbackURL: '/auth/github/callback'
   }, (accessToken, refreshToken, profile, done) => {
     // Handle GitHub OAuth logic here
   }));
   ```

## Running the Application

1. **Start the Node.js server:**

   ```bash
   npm start
   ```

2. **Start the React app (in a different terminal):**

   ```bash
   cd my-app
   npm start
   ```

## API Endpoints

- **GET /auth/google**: Initiates Google OAuth authentication
- **GET /auth/google/callback**: Google OAuth callback URL
- **GET /auth/github**: Initiates GitHub OAuth authentication
- **GET /auth/github/callback**: GitHub OAuth callback URL
- **GET /api/users**: Get all user information
- **GET /api/user/:id**: Get a user information
- **POST /api/users**: Add new demo entry
- **PUT /api/user/:id**: Update demo entry
- **PATCH /api/user/:id**: Partially update demo entry

## Special Instructions

- Ensure you start the React app and the Node.js server in different terminals.
- React app start command:

  ```bash
  cd my-app
  npm start
  ```

- Node server start command:

  ```bash
  npm start
  ```