const jwt=require('jsonwebtoken')
const { Token }=require('../models/TokenModel')
const { UserModel } = require('../models/UserModel')
require('dotenv').config()

/**
 * getting accessToken  && refreshToken
 * @param {*} userInfo 
 * @returns accessToken refreshToken
 */
async function gettingTokens(userInfo){

    const payload={
        id: userInfo._id,
        username: userInfo.username,
        email:userInfo.email
            
    }
        
    const accessToken=jwt.sign(payload,process.env.jwtAccessSecret,{expiresIn:process.env.jwtAccessSecretLT})
    // Refresh Token
 
    const newRefresh=new Token( {
            client_id:userInfo._id
    })
    
    let newRefreshToken=await newRefresh.save()

    let tokenId={tokenId:newRefreshToken._id.toString()}
    const refreshToken=jwt.sign(tokenId,process.env.jwtRefreshSecret,{expiresIn:process.env.jwtRefreshSecretLT})
    
    return {
        accessToken,
        refreshToken
    
    }       
}
/**
 * refreshing Tokens 
 * @param {*} req req.headers["authorization"] getting refresh token
 * @param {*} res is  userinfo, accessToken && refreshToken
 * @returns if any error return res.json({error:{error info}})
 */

async function refreshToken(req,res){
    try{ 
        let tokenBarear = req.headers["authorization"] ;
        let token=tokenBarear.split(" ")[1]
    
        if (!token) {
          return res.json({ error: "No token provided!" });
        }
      
        jwt.verify(token,process.env.jwtRefreshSecret ,async (err, decoded) => {
          try{
            if (err) {
                   return res.json({ error: err.message });
          }
          let token_id=decoded.tokenId
     
          let refreshTokenObj=await Token.findOne({_id:token_id})
       
          let client_id=refreshTokenObj.client_id
          
          let user=await UserModel.findOne({_id:client_id})
  
         let {accessToken, refreshToken}=await   gettingTokens(user)

         if(client_id){
          let deleteResult=await Token.deleteOne({_id:token_id})
          }
     
          return res.json({user, accessToken,refreshToken})
         
          }catch(err){

            return res.json({ error:err.message})
        } 
 
      })

    }catch(err){
        return res.json({ error:err.message})
    }
}
 
/**
 * Log Out user deleting refresh token
 * @param {*} req req.headers["authorization"] getting refresh token
 * @param {*} res sending res.json deleted user  count
 * @returns if any error return res.json({error:{error info}})
 */
async function logOut(req,res){
  try{ 
      let tokenBarear = req.headers["authorization"] ;
      let token=tokenBarear.split(" ")[1]
  
      if (!token) {
        return res.json({ error: "Anexpected problem" });
      }
    
      jwt.verify(token,process.env.jwtRefreshSecret ,async (err, decoded) => {
        try{
          if (err) {
                 return res.json({ error: err.message });
        }
        let token_id=decoded.tokenId
      
        let deleteResult=await Token.deleteOne({_id:token_id})
          return res.json({deletedCount:deleteResult.n });
        
          }catch(err){

          return res.json({ error:err.message})
      } 
 
    })

  }catch(err){
      return res.json({ error:err.message})
  }
}
/**
 * Deleting all refreshTokens of user and User info
 * @param {*} req req.headers["authorization"] getting refresh token
 * @param {*} res sending done : res.json({result:"done"})
 * @returns 
 */
async function deleteAccount(req,res){
  try{ 
    
      let tokenBarear = req.headers["authorization"] ;
      let token=tokenBarear.split(" ")[1]
  
      if (!token) {
        return res.json({ error: "Anexpected problem" });
      }    
      jwt.verify(token,process.env.jwtAccessSecret ,async (err, decoded) => {
        try{
          if (err) {
                 return res.json({ error: err.message });
        }
 
        let userId=decoded.id
        await Token.deleteMany({client_id:userId})
        await UserModel.deleteOne({_id:userId})
               
        return res.json({result:"done"});
            
        }catch(err){
          return res.json({ error:err.message})
      } 
 
    })
  }catch(err){
     return res.json({ error:err.message})
  }
}
/**
 * page for extra Question about deleting accouant
 * @param {*} res rendering question view
 * @returns 
 */
function deleteView(req,res){
  res.render("deleteAccount")
}

module.exports={gettingTokens, refreshToken,logOut, deleteAccount,deleteView}
