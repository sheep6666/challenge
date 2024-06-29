const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    photo:{
        type: String,
    },
    amount:{
        type: Number,
        default: 0,
        required: true,
    },
})

// 計算密碼雜湊後，再進行比較
userSchema.methods.comparePassword = function (password, cb){
    bcrypt.compare(password, this.password, (err, isMatch)=>{
        if (err){
            return cb(err, isMatch)
        }
        cb(null, isMatch)
    })
}

// 每次儲存用戶數據前，先執行中間件
userSchema.pre("save", async function(next){
    // 只有在密碼變更時，才需要重新計算 Hash
    if(this.isModified("password") || this.isNew){
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
        next()
    }else{
        return next()
    }
})

module.exports = mongoose.model("User", userSchema)