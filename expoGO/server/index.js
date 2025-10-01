const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3306;  // Cambié el puerto a 5000 para evitar conflictos con MySQL

app.use(express.json());  // Para poder leer los datos del cuerpo de la solicitud como JSON

// Configuración de conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'escuela',  // Asegúrate de que esta es la base de datos correcta
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) throw err;
  console.log('Conexión exitosa a la base de datos');
});

// Endpoint para el login
app.post('/login', (req, res) => {
  const { nombre, contrasena } = req.body;

  // Consulta SQL para validar al usuario por nombre y contraseña
  const query = 'SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?';
  connection.query(query, [nombre, contrasena], (err, rows) => {
    if (err) {
      return res.status(500).send('Error en la consulta de la base de datos');
    }

    if (rows.length > 0) {
      return res.status(200).send({
        message: 'Login exitoso',
        userId: rows[0].id,   // Devolver el ID del usuario si el login es exitoso
        nombre: rows[0].nombre, // Puedes devolver el nombre si lo necesitas
      });
    } else {
      return res.status(401).send({ message: 'Usuario o contraseña incorrectos' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
