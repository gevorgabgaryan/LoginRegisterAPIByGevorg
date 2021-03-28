
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 12;
const UserSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
     lowercase: true,
   },
  password: {
    type: String,
     trim: true,
  },
  isVerified: {
       code:{
         type: Number,         
       },
       status:{
        type: Boolean, 
         default: false
      },
      
  },
  firstname: {
        type: String,
     },
  lastname: {
      type: String,
    },  
  image:{
            type:String,
            default:"/default_profile.png"
  },
},{timestamps:true})

UserSchema.pre("save", async function(next){
  const user=this

  if(!user.isModified("password")) return next()
try{
    console.time("hash")
  let hash=await  bcrypt.hash(user.password, SALT_ROUNDS)
  console.log(hash)
  user.password=hash
  console.timeEnd("hash")
  return next()


     }catch(err){
         return   next(err)
     }
}) 

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
   return await bcrypt.compare(candidate, this.password);
};

const UserModel=mongoose.model("user", UserSchema)

  
  module.exports = {

    UserModel
  };
