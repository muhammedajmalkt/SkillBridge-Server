const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()
const app = express()
const cors = require("cors")
const authRouter = require("./Routers/authRouter")
const swapRouter = require("./Routers/swapRouter")
const transactionRouter = require("./Routers/swapTransactionRouter")
const cookieParser = require("cookie-parser")
const http = require("http")
const server = http.createServer(app)
const {Server} = require("socket.io")
const { notificationSocket } = require("./Sockets/notificationSocket")
const { chatSocket } = require("./Sockets/chatSocket")
const chatRouter = require("./Routers/chatRouter")
const groupRouter = require("./Routers/groupRouter")
const favouriteRouter = require("./Routers/favouriteRouter")
const { videoCall } = require("./Video/VideoCall")


app.use(express.json())
app.use(cookieParser())

const option = {
    origin : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
    credentials: true,
}
app.use(cors(option))

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials:true
    }
});
app.use((req,res,next)=>{
    req.io=io
    next()
})
notificationSocket(io)
chatSocket(io)
videoCall(io)


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Database connected"); 
})
.catch((err)=>{
    console.log(err)    
})

app.use("/api/user",authRouter)
app.use("/api/user",swapRouter)
app.use("/api/user",transactionRouter)
app.use("/api/user",chatRouter)
app.use("/api/user",groupRouter)
app.use("/api/user",favouriteRouter)

server.listen(process.env.PORT || 9000,()=>{
    console.log("server 🚀")   
})
 