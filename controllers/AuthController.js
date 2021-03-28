const random=require("random")

const {gettingTokens}=require('./TokenController')

const { sendMail } = require('./MailController')
const { UserModel } = require("../models/UserModel")
require("dotenv").config()

class AuthController {
    /**
    * register New User , saving user info in DB , sending code to email for verefying email,
     after it sending user mongo DB  id as json response
    * @param {*} req  getting  req.body (username, email,password)
    * @param {*} res res new User Mongo DB id
    */
    async registerNewUser(req,res){
   
       try{
        let code=random.int(1e6,1e7-1)
        let user=new  UserModel({
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
            })
           user.isVerified.code=code
       let userSaved=await user.save()
        try{
       

          let html=`<p>${code}</p>
           <p><a href='${req.headers.host}/auth/verify/${userSaved._id}'>Verify Mail</a></p>`
          let result=await  sendMail(userSaved.email,"Verify Mail",null,html)
           res.json({id:userSaved._id})

        }catch(err){
             res.json(err.message)
        }
    
        
       }catch(err){
             res.json(err.message)
         }
     }
    /**
    * verifying user by link sending   email address changing isVerified.status=true  in DB
    * @param {*} req  getting  req.params getting user id
    * @param {*} res res redirect main page
    */
    async verifyUserGet(req,res){
       let id=req.params.id;
       let code=req.params.code;
       let userCode=await UserModel.findOne({_id:id}).select("_id isVerified")
       if(userCode && userCode.isVerified.code==code){
          try{
            userCode.isVerified.status=true
            await userCode.save()
            res.redirect("/")
          }catch(err){
            res.redirect(`/auth/register?error=${err.message}`)
          }          
       }else{
          res.redirect("/auth/register/?error=Code dont match")
       }
     }
    /**
    * verifying user by code sending   email address, changing  isVerified.status=true  
    * @param {*} req  getting  req.body getting user id
    * @param {*} res res redirect main page
    */
     async verifyUserPost(req,res){     
        let code=req.body.code;
        let id=req.body.userId; 
         console.log(req.body.code)
        let userCode=await UserModel.findOne({_id:id}).select("_id isVerified")
        console.log(userCode.isVerified.code)
        if(userCode && userCode.isVerified.code==code){          
           try{            
               if(!req.body.userId){
                  res.json({error:"no"})
                  return
               }   
             userCode.isVerified.status=true           
             let result=await userCode.save()     
             res.json({id:result._id})
           }catch(err){
             res.json({errorr:err})
           }           
        }else{
          res.json({error:"Code dont match"})
        }    
      }
       /**
        * login user by email and password
        * @param {*} req  getting  req.body (email,password)
        * @param {*} res sending userInfo, accessToken,refreshToken
      */
      async  loginUser(req,res){  
            try{ 
                 let email=req.body.email
                 const user= await UserModel.findOne({email:email},(err,result)=>{
            }) 
             if(!user){
                     return res.json({error:"Invalid Email or Password"})
                 }
             const passwordOk=await user.comparePassword(req.body.password);         
             if(!passwordOk){
                     return res.json({error:"Invalid Email or Password"})
              }   
             try{
                let {accessToken, refreshToken}=await   gettingTokens(user)
                return res.json({user, accessToken,refreshToken});
              }catch(err){
         
                return res.json({error:err.message})
              }             
       
            }catch(err){                
                 return res.json({error:err.message})
            }   
          }
      /**
        * login user with Facebook or Gmail 
        * @param {*} req  getting userInfo from API throw req.user 
        * @param {*} res sending script code for refreshing 
        tokens and redirect main page
      */
      async  loginWithAPI(req,res){
      
           try{ 
            //facebook API 
                 if(req.user.provider=="facebook"){
                 let user={
                 username:req.user.name.familyName,
                 email:req.user.emails[0].value,
                }              
                let newUser=await loginAPIUserCreator(user)
               
                try{

                let {accessToken, refreshToken}=await   gettingTokens(newUser)
        
                return res.send(`
                <script>
                  localStorage.setItem("AuthAccessToken", '${accessToken}')
                  localStorage.setItem("AuthRefreshToken",'${refreshToken}')
                  location.href="/"
                </script>
                `)
              
              }catch(err){
                return res.send(`
                <script>
                        location.href="/"
                </script>
                `)
              }       
            }else if(req.user.provider=="google"){
                  let user={
                     username:req.user.displayName,
                     email:req.user.email,
                  }
                
                    let newUser=await loginAPIUserCreator(user)
              
                    try{
                    let {accessToken, refreshToken}=await   gettingTokens(newUser)
                    return res.send(`
                    <script>
                      localStorage.setItem("AuthAccessToken", '${accessToken}')
                      localStorage.setItem("AuthRefreshToken",'${refreshToken}')
                      location.href="/"
                    </script>
                    `)              
                  }catch(err){
                 
                    return res.send(`
                    <script>            
                                location.href="/"
                    </script>
                    `)
                  } 
                }else{
                     return res.send(`
                    <script>                 
                      location.href="/"
                    </script?
                    `)
                  
                }  
                    
               }catch(err){    
                      
                  return res.send(`
                    <script>                 
                      location.href="/"
                    </script?
                    `)
              }   
            }
        /**
          * starting reset password sending code to emal
          * @param {*} req  getting  req.body (email)
          * @param {*} res sending user id
        */   

        async resetPassword(req,res){  
                     try{
                      let code=random.int(1e6,1e7-1)                   
                      let email=req.body.email                 
                      let user= await UserModel.findOne({email:email})    
                             
                      if(!user){
                             res.json({error:"Not founded"})
                      }
                      user.isVerified.code=code          
                      let userChanged= await user.save()  
               console.log(userChanged.isVerified.code.toString())                   
                      try{
                          await  sendMail(userChanged.email,"reset password",userChanged.isVerified.code.toString());
                     
                           res.json({id:user._id}) 
                                    
                      }catch(err){
                        console.log(err)
                          res.json(err.message)
                      }                 
                      
                     }catch(err){
                    console.log(err)
                    
                          res.json(err.message)
                     }
      }
       /**
          * seting new password 
          * @param {*} req  getting  req.body where id and new passord
          * @param {*} res sending 'done'
        */ 
      async  setNewPassword(req,res){             
              try{            
                 let id=req.body.id
                 const user= await UserModel.findOne({_id:id})
                 user.password=req.body.password
                 await user.save()            
                 return res.json({result:"done"});
              }catch(err){         
                return res.json({error:err.message})
              }
           
      }        

}
/**
 * saving 
 * @param {*} req req.headers["authorization"] getting refresh token
 * @param {*} res sending done : res.json({result:"done"})
 * @returns 
 */

 /**helper function for saving info geting from API */
 async function loginAPIUserCreator(user){
  try{

      let newUser=await UserModel.findOne({email:user.email})

       if(!newUser){
          newUser=new  UserModel(user)
        }
     
        newUser.isVerified.status=true
    
        return await newUser.save()
  }catch(err){

    return err.message
  }
    
        
}

module.exports=new AuthController()
