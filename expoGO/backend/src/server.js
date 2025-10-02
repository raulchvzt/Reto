// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "./db.js";
import morgan from "morgan";

dotenv.config();
const app = express();

// Logs HTTP útiles en desarrollo
app.use(morgan("dev"));

// CORS amplio para desarrollo + manejo de preflight sin usar "*" (Express 5)
app.use(
  cors({
    origin: true, // refleja el Origin que venga
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// Responder explícitamente cualquier preflight
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

// Middleware para validar JWT
function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: "Falta token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Token inválido/expirado" });
  }
}

// --- RUTA DE SALUD ---
app.get("/", (_, res) => res.send("API OK"));

// --- LOGIN ---
app.post("/auth/login", async (req, res) => {
  const { nombre, contrasena } = req.body;
  if (!nombre || !contrasena)
    return res.status(400).json({ ok: false, error: "Faltan campos" });

  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, contrasena FROM usuarios WHERE nombre = ?",
      [nombre]
    );
    if (!rows.length)
      return res
        .status(401)
        .json({ ok: false, error: "Usuario o contraseña inválidos" });

    const u = rows[0];
    const isHashed =
      u.contrasena?.startsWith("$2a$") || u.contrasena?.startsWith("$2b$");
    const isValid = isHashed
      ? await bcrypt.compare(contrasena, u.contrasena)
      : contrasena === u.contrasena;

    if (!isValid)
      return res
        .status(401)
        .json({ ok: false, error: "Usuario o contraseña inválidos" });

    const token = jwt.sign(
      { id: u.id, nombre: u.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ ok: true, token, user: { id: u.id, nombre: u.nombre } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- PROTEGIDO: LISTAR MATERIAS ---
app.get("/materias", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.idMateria, m.nombre, m.calificacion, s.estado
      FROM materias m
      LEFT JOIN status s ON s.idStatus = m.idStatus
      ORDER BY m.idMateria DESC
    `);
    res.json({ ok: true, data: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () =>
  console.log(`API escuchando en http://localhost:${port}`)
);
