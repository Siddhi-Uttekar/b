# 🎓 Student Records Updater (PostgreSQL + Node.js)

A simple Node.js CLI application to insert or update student records in a PostgreSQL database (e.g., NeonDB). This script ensures table creation, validates user input, and performs safe inserts with conflict resolution.

---

## 📦 Features

- Connects to your **NeonDB** PostgreSQL database
- Creates `students` table if it doesn’t exist
- Accepts user input from terminal
- Validates:
  - `roll number`, `year`, and subject marks must be numeric
  - Marks must be between **0 and 100**
- Uses **UPSERT** (insert or update on conflict)

---

## 🚀 How to Run

### Install dependencies

```bash
npm install
```

### Get a NeonDB Connection String
1. Go to [NeonDB](https://neon.tech/)
2. Create a new project
3. Get the connection string from the dashboard
4. use this connection string at the time of prompt execution

It will look something like this:
```
postgres://username:password@db.<region>.neon.tech:5432/dbname
```
### Run the script

```bash
node index.js
```