const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes — all prefixed with /api/
app.use("/api/groups",       require("./routes/groupRoutes"));
app.use("/api/expenses",     require("./routes/expenseRoutes"));
app.use("/api/users",        require("./routes/userRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

// Health check
app.get("/", (req, res) => res.json({ status: "API is running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));