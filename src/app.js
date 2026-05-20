require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("./utils/cronjob");

app.use(
  cors({
    origin: "https://vercel.com/new/rohit9198s-projects/success?auto-redirect=true&developer-id=&external-id=&redirect-url=&branch=main&deploymentUrl=dev-tinder-g6a8zuomi-rohit9198s-projects.vercel.app&projectName=dev-tinder&s=https%3A%2F%2Fgithub.com%2FRohit9198%2FDevTinder&gitOrgLimit=&hasTrialAvailable=1&totalProjects=1&flow-id=QyfIgwi95yc292nNLk0nT",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });



