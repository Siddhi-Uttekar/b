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

function validateNumber(input, fieldName, min = -Infinity, max = Infinity) {
	const value = Number(input);
	if (isNaN(value)) {
		console.error(`❌ Invalid ${fieldName}: must be a number.`);
		process.exit(1);
	}
	if (value < min || value > max) {
		console.error(`❌ ${fieldName} must be between ${min} and ${max}.`);
		process.exit(1);
	}
	return value;
}

async function createStudentsTable(connection) {
	const createTableQuery = `
		CREATE TABLE IF NOT EXISTS students (
			rollNo INTEGER PRIMARY KEY,
			name TEXT NOT NULL,
			dept TEXT NOT NULL,
			year INTEGER NOT NULL,
			sub1 INTEGER NOT NULL,
			sub2 INTEGER NOT NULL,
			sub3 INTEGER NOT NULL,
			sub4 INTEGER NOT NULL,
			grade TEXT NOT NULL
		);
	`;

	try {
		await connection.query(createTableQuery);
		console.log("✅ Ensured 'students' table exists.");
	} catch (err) {
		console.error("❌ Error creating table:", err);
		process.exit(1);
	}
}

async function updateStudentRecords(connection, students) {
	const query = `INSERT INTO students (rollNo, name, dept, year, sub1, sub2, sub3, sub4, grade) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
		ON CONFLICT (rollNo) DO UPDATE SET 
		name=EXCLUDED.name, dept=EXCLUDED.dept, year=EXCLUDED.year, 
		sub1=EXCLUDED.sub1, sub2=EXCLUDED.sub2, sub3=EXCLUDED.sub3, sub4=EXCLUDED.sub4, grade=EXCLUDED.grade`;

	for (const student of students) {
		try {
			await connection.query(query, [
				student.rollNo,
				student.name,
				student.dept,
				student.year,
				student.sub1,
				student.sub2,
				student.sub3,
				student.sub4,
				student.grade,
			]);
			console.log(
				`✅ Student with rollNo ${student.rollNo} updated successfully.`
			);
		} catch (err) {
			console.error("❌ Error updating student record:", err);
		}
	}
}

async function getUserInput() {
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

	await createStudentsTable(connection);

	const numStudents = validateNumber(
		await askQuestion("How many students would you like to enter? "),
		"Number of students",
		1
	);

	const students = [];

	for (let i = 0; i < numStudents; i++) {
		console.log(`\nEnter details for student ${i + 1}:`);
		const rollNo = validateNumber(
			await askQuestion("Enter roll number: "),
			"Roll number",
			1
		);
		const name = await askQuestion("Enter name: ");
		const dept = await askQuestion("Enter department: ");
		const year = validateNumber(
			await askQuestion("Enter year: "),
			"Year",
			1900,
			2100
		);
		const sub1 = validateNumber(
			await askQuestion("Enter marks for subject 1: "),
			"Subject 1 marks",
			0,
			100
		);
		const sub2 = validateNumber(
			await askQuestion("Enter marks for subject 2: "),
			"Subject 2 marks",
			0,
			100
		);
		const sub3 = validateNumber(
			await askQuestion("Enter marks for subject 3: "),
			"Subject 3 marks",
			0,
			100
		);
		const sub4 = validateNumber(
			await askQuestion("Enter marks for subject 4: "),
			"Subject 4 marks",
			0,
			100
		);
		const grade = await askQuestion("Enter grade: ");

		students.push({ rollNo, name, dept, year, sub1, sub2, sub3, sub4, grade });
	}

	await updateStudentRecords(connection, students);
	rl.close();
	connection.end();
}

getUserInput();
