const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();
const port = process.env.PORT || 3000;

const dbConfig = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 100,
	queueLimit: 0,
};

const app = express();

app.use(express.json());

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.get("/allmovies", async (req, res) => {
	try {
		let connection = await mysql.createConnection(dbConfig);
		const [rows] = await connection.execute(
			"SELECT * FROM defaultdb.watchlist"
		);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch movies" });
		console.error(error);
	}
});

app.post("/addmovie", async (req, res) => {
	const { movie_title, genre, poster_url } = req.body;
	try {
		let connection = await mysql.createConnection(dbConfig);
		const [result] = await connection.execute(
			"INSERT INTO defaultdb.watchlist (movie_title, genre, poster_url) VALUES (?, ?)",
			[movie_title, genre, poster_url]
		);
		res
			.status(201)
			.json({ message: "Movie added successfully", movie_id: result.insertId });
	} catch (error) {
		res.status(500).json({ error: `Failed to add movie ${movie_title}` });
		console.error(error);
	}
});
