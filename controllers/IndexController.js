const { UserModel }= require("../models/UserModel");
 class IndexController {
       /**rendring main page */
        index(req,res){
            render('index')
        }
        /**gettin user id frome decoded id and sending home page info */
        async  homeContent(req,res){
             let userInfo=await UserModel.findOne({_id:req.user.id}).lean().exec()
              res.json({user:userInfo})
         }
   

} 

 module.exports=new IndexController()
    