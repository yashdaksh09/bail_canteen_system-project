const express= require("express");
const cors= require("cors");
const mysql= require("mysql2");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234", // apna actual MySQL password likho
  database: "employee_auth",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ MySQL Connected Successfully (employee_auth)");
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// ✅ Employee fetch route (for QR code)
app.get("/get-employee/:code", (req, res) => {
  const code = req.params.code;
  db.query(
    "SELECT * FROM employee_qr WHERE employee_code = ?",
    [code],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length === 0)
        return res.status(404).json({ message: "Employee not found" });
      res.json(result[0]);
    }
  );
});

// ✅ Meal submit route
app.post("/submit-meal", (req, res) => {
  const {
    employee_code,
    employee_name,
    employee_department,
    employee_designation,
    meal_type,
    quantity,
  } = req.body;

  if (!employee_code || !meal_type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const token_number = Math.floor(100000 + Math.random() * 900000);

  const sql = `
    INSERT INTO canteen_system_data 
    (employee_code, employee_name, employee_department, employee_designation, meal_type, quantity, token_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      employee_code,
      employee_name,
      employee_department,
      employee_designation,
      meal_type,
      quantity,
      token_number,
    ],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "❌ This meal has already been taken today." });
        }
        return res.status(500).json({ error: err });
      }
      res.json({ // chrome console show data in json format
        message: "✅ Meal recorded successfully",
        token_number,
        order_time: new Date().toISOString(),  
      });
    }
  );
});

//Meal Status API
app.get("/get-meal-status", (req, res) => {
  db.query("SELECT * FROM canteen_system_data ORDER BY order_time DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

app.listen(8281, () => {
  console.log("🚀 Server running on http://localhost:8281");
});
