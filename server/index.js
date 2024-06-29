const express = require("express")
const app = express()
const path = require('path');
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const authRoute = require("./routes/auth")
const taskRoute = require("./routes/task")
const userRoute = require("./routes/user")
const cors = require('cors');
mongoose
    .connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME
    })
    .then(()=>{
        console.log("Connect to mongoDB.");
    })
    .catch((e)=>{
        console.log(e);
    })
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/auth", authRoute)
app.use("/api/task", taskRoute)
app.use("/api/user", userRoute)

// 取得資源 (圖片)
const resourceDir = path.join(__dirname, "uploads")
app.use(resourceDir, express.static(resourceDir));
app.get('/api/resource/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(resourceDir, filename);
    console.log(filename);
    res.sendFile(filePath, err => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).json({ message: 'File not found' });
      }
    });
  });

app.listen(8080, ()=>{
    console.log("Server running on 8080");
})