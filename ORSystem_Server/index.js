const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./src/config/dbConnection");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");

// Routers
const userRouter = require("./src/routes/userRouter");
const orgRouter = require("./src/routes/organizationRouter");
const authRouter = require("./src/routes/authRouter");
const venueRouter = require("./src/routes/venueRouter");
const deviceRouter = require("./src/routes/deviceRouter");
const authenticate = require("./src/middlewere/authMiddleware");
const alertsRouter = require("./src/routes/alertsRouter");


// Utilities
const { espAlertSocket } = require("./src/utils/espAlertSocket");

dotenv.config();
dbConnection();
// const port = 5050;
const port = 5000;
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/organization", authenticate, orgRouter);
app.use("/venue",  venueRouter);
app.use("/device",   deviceRouter);
app.use("/alert", alertsRouter);


const alertWss = espAlertSocket(server);

// alerts ws://ip:5000/ws/alerts
server.on("upgrade", (req, socket, head) => {
    if (req.url === "/ws/alerts") {
        alertWss.handleUpgrade(req, socket, head, (ws) => {
            alertWss.emit("connection", ws, req);
        });
    } else {
        socket.destroy(); // reject unknown paths
    }
});


// Start server
// server.listen(port, "0.0.0.0", () => {
//     console.log(`Express & Socket.IO running on port: ${port}`);
// });

server.listen(port , ()=> {
    console.log(`Express & WebSocket is running on port : ${port}`);
})