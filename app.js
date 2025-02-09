const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const sequelize = require("./config/db-config");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoute");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/orders");
const ForgotPasswordRequest = require("./models/ForgotPasswordRequest");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.use("/user", userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", forgotPasswordRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public"));
});

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

ForgotPasswordRequest.belongsTo(User);
User.hasMany(ForgotPasswordRequest);

const port = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:3000`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
