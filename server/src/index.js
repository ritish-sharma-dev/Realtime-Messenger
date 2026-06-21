import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import userRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

//MIDDLEWARE SETUP
app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.use("/api/status", (req, res) => {
  res.send("Server is live");
});
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

//CONNECT TO MONGODB DATABASE
await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}

//EXPORT SERVER FOR VERCEL
export default server;
