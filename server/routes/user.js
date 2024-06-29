const express = require("express")
const router = require("express").Router()
const multer = require('multer');
const path = require('path');
const sharp = require('sharp')
const User = require("../models").userModel 
const Task = require("../models").taskModel 
const TaskUser = require("../models").taskUserModel 
const resourceDir = path.join(path.dirname(__dirname), "uploads")

// 上傳活動照片  
// 设置存储引擎和文件存储位置， 初始化 multer 中间件
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/:userId/upload", upload.single('image'), async (req, res)=>{
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.params.userId
    const taskId = req.query.taskId
    const file = req.file
    const saveName = `${Date.now()}${path.extname(file.originalname)}`
    const savePath = path.join(resourceDir, saveName);
    try {
      await sharp(req.file.buffer)
        .resize(300)
        .jpeg({ quality: 80 }) 
        .toFile(savePath);
    } catch (error) {
      console.error('Error compressing file:', error);
      return res.status(500).json({ message: 'Error compressing file' });
    }

    await TaskUser.findOneAndUpdate(
        {userId, taskId},
        { $push: { photos: saveName } }, 
        { new: true }
    )
        .then(updatedUser => {
          console.log('Updated user:', updatedUser);
          res.status(200).json({ message: 'File uploaded and compressed successfully', path: savePath });
        })
        .catch(error => {
          console.error('Error updating user:', error);
          res.status(400).send(error)
        });
})

// 用戶加入活動
router.put("/:userId/join", async (req, res)=>{
    const userId = req.params.userId
    const taskId = req.query.taskId

    // 檢查用戶是否已參加活動
    let tuPair = await TaskUser.findOne({userId, taskId})
    if (tuPair){ return res.status(200).send("User has joined the task")}

    // 添加用戶|活動配對
    tuPair = new TaskUser({
        userId: userId,
        taskId: taskId,
        startTime: Date.now()
    })
    try {
        const savedPair = await tuPair.save()
    }catch(err) {
        console.log(err);
        return res.status(200).send("Join faild!")
    }

    // 更新任務參加人數
    await Task.findOneAndUpdate(
        {_id:taskId},
        { $inc: { participants: 1 } }, 
        { new: true }
    )
    .then(updatedTask => {
        console.log('Updated Task:', updatedTask);
        return res.status(200).json({ message: 'Task update successfully', updatedTask });
    })
    .catch(error => {
        console.error('Error updating Task:', error);
        return res.status(400).send(error)
    });
})

// 用戶列表
router.get("/userlist", async (req, res)=>{
    let userData = await User.find()
        .then((data)=>{
            res.status(200).send(data)
        }).catch((e)=>{
            res.status(500).send(e)
        })
})

// 用戶信息
router.get("/:userId/details", async (req, res)=>{
    let {userId} = req.params
    let userData = await User.findOne({_id:userId})
        .then((data)=>{
            res.status(200).send(data)
        }).catch((e)=>{
            res.status(500).send(e)
        })
})

// 用戶參加的活動
router.get("/:userId/tasks", async (req, res)=>{
    let {userId} = req.params
    let taskData = await TaskUser.find({userId})
        .populate("taskId", ["taskName", "threshold", "startDate", "endDate", "photo"])
        .then((data)=>{
            res.status(200).send(data)
        }).catch((e)=>{
            res.status(500).send(e)
        })
})

// 用戶的活動參加詳情
router.get("/:userId/progress", async (req, res)=>{
    let {userId} = req.params
    let taskId = req.query.taskId
    let joinData = await TaskUser.findOne({userId, taskId})
        .populate("taskId", ["taskName", "threshold", "startDate", "endDate", "photo"])
        .then((data)=>{
            res.status(200).send(data)
        })
        .catch((e)=>{
            res.status(500).send(e)
        })
    
})

module.exports = router