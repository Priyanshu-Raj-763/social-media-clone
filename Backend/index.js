import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import cors from "cors"
import DbConnnect from "./utils/db.js";
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import postRouter from "./routes/post.routes.js"
import { app, server } from "./socket/socket.js";
import path from "path"

const PORT = process.env.PORT || 8000;

const __dirname = path.resolve()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
    origin:[ process.env.VITE_API_URL,"http://localhost:5173","http://localhost:4173"],
    credentials: true
}
app.use(cookieParser());
app.use(cors(corsOptions))
app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/message", messageRouter)


if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "Frontend", "dist")))
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"))
})}

DbConnnect().then(() => {
    server.listen(PORT, () => console.log(`server is listening to PORT ${PORT}`))

}).catch((err) => {
    console.log("Failed to Connect with MONGO ❌", err)
    process.exit(1)
})
