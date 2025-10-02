// login.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "escuela",
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err);
    return;
  }
  console.log("✅ Conexión establecida con MySQL");
});

app.post("/login", (req, res) => {
  const { nombre, contraseña } = req.body;

  if (!nombre || !contraseña) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?",
    [nombre, contraseña],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err });

      if (results.length > 0) {
        res.json({ success: true, message: "Login correcto", user: results[0] });
      } else {
        res.json({ success: false, message: "Usuario o contraseña incorrectos" });
      }
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
