const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    threshold:{
        type: Number,
    },    
    startDate:{
        type: Date,
    },
    endDate: {
        type: Date,
    },
    participants: {
        type: Number,
    },
    photo:{
        type:String
    }
})

module.exports = mongoose.model("Task", taskSchema)