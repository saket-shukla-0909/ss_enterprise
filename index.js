const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const sequelize = require("./mysequelize2");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/users', require('./routes/usersRoutes'));
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(process.env.SERVER_PORT, (error) => {
      if (error) {
        console.error("❌ Server startup error:", error);
      } else {
        console.log(`🚀 Server has started on PORT ${process.env.SERVER_PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error("❌ Sequelize sync error:", err);
  });
