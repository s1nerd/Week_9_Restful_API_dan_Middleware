const { Pool } = require("pg"); // Jika Anda menggunakan 'pg' module

// Konfigurasi koneksi ke database
const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "hw9",
  password: "ngodingasik123",
  port: 5432, // Port default PostgreSQL
};

const pool = new Pool(dbConfig);

// Menggunakan pg-promise jika Anda memilihnya
// const pgp = require('pg-promise')();
// const db = pgp(dbConfig);

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database at:", res.rows[0].now);
  }
});

app.post("/register", async (req, res) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const text =
      "INSERT INTO users(username, password) VALUES($1, $2) RETURNING *";
    const values = [req.body.username, hashedPassword];

    const result = await pool.query(text, values);

    res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

process.on("SIGINT", () => {
  pool.end(); // Tutup koneksi pool saat aplikasi berhenti
  process.exit(0);
});
