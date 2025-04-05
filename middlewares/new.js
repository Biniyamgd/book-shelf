require("dotenv").config();
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieParser = require("cookies");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(cookieParser());
app.use(passport.initialize());

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Generate JWT Token
function generateToken(user) {
  return jwt.sign({ id: user.id, name: user.displayName }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
}

// Routes
app.get("/", (req, res) => {
  res.send(`
    <h1>Google OAuth with Cookies</h1>
    <a href="/auth/google">Login with Google</a>
  `);
});

// Google OAuth login route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = generateToken(req.user);

    // Set cookie with the token
    res.cookie("auth_token", token, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: false, // Set true in production (requires HTTPS)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.redirect("/dashboard");
  }
);

// Protected route (only accessible if logged in)
app.get("/dashboard", verifyToken, (req, res) => {
  res.send(`
    <h1>Dashboard</h1>
    <p>Welcome, ${req.user.name}</p>
    <a href="/logout">Logout</a>
  `);
});

// Logout & clear cookies
app.get("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.redirect("/");
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) return res.redirect("/");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.redirect("/");
  }
}

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));





/*async function getBookById(req, res) {
    const bookId = req.params.id;

    // 🔍 Check if data exists in Redis
    const cachedBook = await redisClient.get(`book:${bookId}`);
    if (cachedBook) {
        console.log("Cache Hit ✅");
        return res.json(JSON.parse(cachedBook));
    }

    console.log("Cache Miss ❌");
    // 🛢️ Fetch from MySQL if not found in Redis
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);

    if (rows.length === 0) return res.status(404).json({ error: "Book not found" });

    // 💾 Store result in Redis with expiration (60 seconds)
    await redisClient.setEx(`book:${bookId}`, 60, JSON.stringify(rows[0]));

    res.json(rows[0]);
}


 async function updateBook(req, res) {
    const { id } = req.params;
    const { title, author } = req.body;

    await pool.query('UPDATE books SET title = ?, author = ? WHERE id = ?', [title, author, id]);

    // ❌ Invalidate cache for this book
    await redisClient.del(`book:${id}`);

    res.json({ message: "Book updated successfully" });
}
const redis = require('redis');
const mysql = require('mysql2/promise');

const redisClient = redis.createClient();
redisClient.connect();  // Redis v4+ requires explicit connection

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bookstore',
    connectionLimit: 10
});
*/
 