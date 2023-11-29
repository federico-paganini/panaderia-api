const express = require(`express`);
const app = express();
const https = require('https');

const path = require(`path`);
const mariadb = require('mariadb');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const dotenv = requiere('dotenv');

const port = 3000;
dotenv.config({ path: 'secret.env' });
const dataFolderPath = path.join(__dirname);

const options = {
    key: fs.readFileSync(dataFolderPath, 'server.key'),
    cert: fs.readFileSync(dataFolderPath, 'server.cert'),
};

const server = https.createServer(options, app);

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 5,
});

app.post('/verifylogin', express.json(), async (req, res) => {
    const { username, password } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const user = await conn.query(`SELECT * FROM users WHERE username="${username}" AND password="${password}"`);
        if (user.length === 0) {

            res.status(404).json({ message: 'No se encontró el usuario' });

        } else {

            const token = jwt.sign({ userId: user.Id }, 'secretKey', { expiresIn: '1m' });
            res.json({ token });

        }
    } catch (error) {

        res.status(500).json({ message: "No se pudo conectar al servidor" });

    } finally {

        if (conn) conn.release();

    }
});

app.post("/registrar", express.json(), async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    let conn;
    try {
        conn = await pool.getConnection();
        const response = await conn.query(`INSERT INTO users (username, password) VALUES ("${username}", "${password}")`);

        res.status(201).json({ message: 'Se creó el usuario con el id: ' + parseInt(response.insertId) });
    } catch (error) {
        res.status(500).json({ message: "Se rompió el servidor" });
    } finally {
        if (conn) conn.release();
    }
});

app.listen(port, () => {
    console.log(`servidor corriendo en http://localhost:${port}`);
})