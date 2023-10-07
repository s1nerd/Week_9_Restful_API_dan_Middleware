const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const { Pool } = require("pg"); // Import modul PostgreSQL
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swaggerConfig"); // Ubah path sesuai dengan lokasi file konfigurasi Swagger Anda

const app = express();
const port = process.env.PORT || 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Mendapatkan daftar pengguna
 *     description: Mengambil daftar pengguna dengan paginasi.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Nomor halaman
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Batasan pengguna per halaman
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daftar pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 */

// API endpoint untuk mendapatkan daftar pengguna dengan paginasi
app.get("/users", (req, res) => {
  // Mendapatkan nilai parameter page dan limit dari query string
  const { page, limit } = req.query;

  // Menghitung indeks awal pengguna berdasarkan halaman dan batasan
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Mengambil bagian pengguna yang sesuai dengan halaman dan batasan
  const paginatedUsers = users.slice(startIndex, endIndex);

  // Mengembalikan pengguna yang telah dipaginasi
  res.json({ data: paginatedUsers });
});

// Definisikan objek pool untuk koneksi ke database
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hw9",
  password: "ngodingasik123",
  port: 5432, // Port default PostgreSQL
});

app.use(express.json());
app.use(morgan("dev")); // Logging middleware (opsional)

// Simpan informasi pengguna dalam array (contoh sederhana, gunakan database di produksi)
const users = [];

// Secret key untuk JWT
const secretKey = "ngodingasik123";

// Middleware untuk otentikasi token JWT
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

// API endpoints
app.post("/register", async (req, res) => {
  try {
    // Hash password sebelum disimpan
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Simpan informasi pengguna
    const user = {
      id: users.length + 1,
      username: req.body.username,
      password: hashedPassword,
    };
    users.push(user);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  const user = users.find((u) => u.username === req.body.username);

  if (!user) return res.status(401).json({ error: "Authentication failed" });

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) return res.status(401).json({ error: "Authentication failed" });

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
  res.json({ token });
});

// Endpoint yang memerlukan otentikasi token
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "You have access to this protected resource" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
