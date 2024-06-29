const router = require("express").Router()
const registerValidation = require("../others/validation").registerValidation
const loginValidation = require("../others/validation").loginValidation
const User = require("../models").userModel
const jwt = require("jsonwebtoken")

// 用戶註冊
router.post("/signup", async (req, res)=>{
    console.log(req.body);
    const {error} = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const userExist = await User.findOne({userName: req.body.userName})
    if (userExist) return res.status(400).send("User exists!")
    
    const newUser = new User({
        userName: req.body.userName,
        password: req.body.password,
    })
    try {
        const savedUser = await newUser.save()
        res.status(200).send({
            msg: "success",
            savedObject: savedUser
        })
    }catch(err) {
        console.log(err);
        res.status(200).send("User not saved.")
    }
})

// 用戶登入
router.post("/signin", async (req, res)=>{
    const {error} = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    User.findOne({userName: req.body.userName})
        .then(function(user){
            if (!user){
                return res.status(400).send("User not found")
            }else{
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch){
                        const tokenObject = {_id: user.id, userName: user.userName}
                        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET)
                        res.send({success:true, token: "JWT " + token, user})
                    }else{
                        return res.status(400).send("Wrong password")
                    }
                })
            }
            }).catch((err) => {
                res.status(400).send(err)
            });
})
module.exports = router;