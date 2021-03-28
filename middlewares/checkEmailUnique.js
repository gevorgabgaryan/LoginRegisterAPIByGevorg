const Joi=require("@hapi/joi")
const { UserModel } =require("../models/UserModel")


const checkEmailUnique= async (req,res, next)=>{

    let user =await UserModel.findOne({email:req.body.email})

    if(user) return res.json({error:"Email "+ user.email +" is taken"})
    
    next()
}

module.exports={
     checkEmailUnique
}
