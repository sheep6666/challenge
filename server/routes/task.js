const router = require("express").Router()
const User = require("../models").userModel 
const Task = require("../models").taskModel 
const TaskUser = require("../models").taskUserModel 

// 活動列表
router.get("/tasklist", async (req, res)=>{
    Task.find()
        .then((data)=>{
            res.send(data)
        })
        .catch(()=>{
            res.status(500).send("Error!")
        })
})

// 活動詳情
router.get("/:taskId/details", async (req, res)=>{
    let {taskId} = req.params
    let taskData = await Task.findOne({_id:taskId})
        .then((data)=>{
            return data
        }).catch((e)=>{
            res.status(500).send(e)
        })
    res.status(200).send(taskData)
})

// 活動的參加用戶列表
router.get("/:taskId/participants", async (req, res)=>{
    let {taskId} = req.params
    let joinData = await TaskUser.find({taskId})
        .populate("userId", ["userName", "photo"])
        .then((data)=>{
            return data
        })
        .catch((e)=>{
            res.status(500).send(e)
        })
    res.status(200).send(joinData)
})

module.exports = router;