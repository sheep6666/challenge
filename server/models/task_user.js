const mongoose = require("mongoose")

const taskUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
    },
    duration: {
        type: Number,
    },
    photos:{
        type: [String],
        default: []
    },
    rank:{
        type: Number,
    }
})

module.exports = mongoose.model("task_user", taskUserSchema)