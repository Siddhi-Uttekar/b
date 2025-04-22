const { Client } = require("pg");
const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function askQuestion(query) {
	return new Promise((resolve) =>
		rl.question(query, (answer) => resolve(answer))
	);
}

async function main() {
	const connectionString = await askQuestion(
		"Enter your NeonDB PostgreSQL connection string: "
	);
	const connection = new Client({ connectionString });

	try {
		await connection.connect();
		console.log("✅ Connected to your PostgreSQL database.");
	} catch (err) {
		console.error("❌ Error connecting to the database:", err);
		rl.close();
		return;
	}

	const query = `
		SELECT COUNT(*) AS student_count 
		FROM students 
		WHERE sub1 > 60 OR sub2 > 60 OR sub3 > 60 OR sub4 > 60;
	`;

	try {
		const result = await connection.query(query);
		console.log(
			`📊 Number of students scoring more than 60 in any subject: ${result.rows[0].student_count}`
		);
	} catch (err) {
		console.error("❌ Error executing query:", err);
	}

	connection.end();
	rl.close();
}

main();
