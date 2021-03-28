const homeFunction=(userInfo, posts, nonFriendUsers,onlineUsers)=>{
    mainContainer.innerHTML=""
    mainContainer.insertAdjacentHTML("afterbegin",`<div class="container-fluid text-center  py-5" style="min-height: 100vh;">
    <button id="logOut" class="float-right">LogOunt</button>
    <p>
    <a href="/auth/delete"><button  class="float-right">deleteAccount</button></a>
    </p>
    <h1>${ userInfo.username }</h1>

    <div>
        <img src="/images${userInfo.image  }" id="homeImg" width="200" height="200">
        <p>
            <a href="/profile/${ userInfo._id }">Profile</a>
        </p>
       
     
    </div>


    <div class="container-fluid text-center">
        <div class="row">
            <div class="col-md-2" id="allUsers">
                <h6>Friends</h6>
               
    
            </div>
            <div class="col-md-8" id="myPost">
                <h6>Posts</h6>
                <form action="" id="postForm">
                    <textarea name="" id="" cols="30" rows="4" class="form-controller">
     
                    </textarea>
                    <input type="hidden" value="${ userInfo._id }" name="userId">
                    <input type="hidden" value="${ userInfo.username }" name="username">
                    <p>
                       <input type="submit" value="Add post"> 
                    </p>
                    
                </form>
     
                
                     
                     
               
               
     
                </textarea>
                <main id="postsContainer">

                 
                </main>
         
            </div>
            <div class="col-md-2 bg-dark text-white" >

                <h6>Onlines User</h6>
                <section id="private_messages_block" ></section>
                <main id="onlines">
                     
                </main>
              
            </div>
        </div>
    </div>
`)

    let logOut=document.querySelector("#logOut")
    logOut.addEventListener("click",()=>{
        fetch("/auth/logout", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("AuthRefreshToken")
            }
          }).then(res=>res.json())
          .then(data=>{
            if(data.error){
           alert(data.error)
                    return
            }
            if(data.deletedCount){
                localStorage.removeItem('AuthAccessToken');
                localStorage.removeItem('AuthRefreshToken');
                location.href="/"     
            }
           
                    
            
          })

     
    })
 }
 const forgetPassordFunction=()=>{
    mainContainer.innerHTML=""
    mainContainer.insertAdjacentHTML("afterbegin",`
    <div class="container px-2 pt-5 "> 
        <h1 class="text-center">Reset Password</h1>
        <form id="forgetPasswordForm" class="px-3">
        <p id="forgetPasswordFormP"></p>

        <div class="form-group ">
            <label>Email</label>
            <input type="text" name="email" class="form-control" value="">
            <span class="help-block"></span>
        </div> 
                
        
        <div class="form-group">
            <input type="submit" class="btn btn-primary" value="Submit">
            <input type="reset" class="btn btn-default" value="Reset">
            
        </div>
       
    </form>
    
    <button id="cancelRegisterButton" class="btn btn-primary">Cancel</button>
</div>
    `)
    const forgetPasswordForm=document.querySelector("#forgetPasswordForm")
    forgetPasswordForm.addEventListener("submit", (e)=>{
        
        e.preventDefault()
        let registerObj={
            email:forgetPasswordForm.elements["email"].value,
          }
        fetch("/auth/reset",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
            },
            body:JSON.stringify(registerObj)
        }).then(res=>res.json())
        .then(data=>{
           alert(data.id)
            if(data.error){
               let elem= document.querySelector("#forgetPasswordFormP")
               elem.innerHTML=JSON.stringify(data.error)
                return
            }
            verifyEmailReset(data.id)
         
        })
        
    })
 }
 const loginFunction=()=>{
    mainContainer.innerHTML=""
    mainContainer.insertAdjacentHTML("afterbegin",`
    <div class="container px-2 pt-5 ">
     
         <form method="POST" action="/auth/login" id="loginForm" class="px-3">
           <p id="loginFormP"></p>
           <div class="form-group pt-5">
               <label for="exampleInputEmail1">Email address</label>
               <input name="email" type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
           </div>
           <div class="form-group pt-5">
               <label for="exampleInputPassword1">Password</label>
               <input name="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
           </div>
         
           
           <button type="submit" class="btn btn-primary">Login</button>
         
       </form>
       <div class="p-2">
          <button id="forgetPassword" class="btn btn-outline-danger">Forgot Password?</button>
       </div>
       <div class="p-2">
       <a href="/auth/google"><button class="btn btn-outline-primary"><span class="fa fa-google"></span>Login with Google</button></a>
       <a href="/auth/facebook"><button class="btn btn-outline-primary"><span class="fa fa-facebook"></span> Login with Facebook</button></a>
       </div>
       
       <p class="my-5">
         <button id="registerButton" class="btn btn-outline-success">Register now</button>
       </p>
       
   </div>`)
   const registerButton=document.querySelector("#registerButton")
   
   registerButton.addEventListener("click",registerFunction)
       const loginForm=document.querySelector("#loginForm")
       loginForm.addEventListener("submit", (e)=>{
           e.preventDefault()
           let loginObj={
               email:loginForm.elements["email"].value,
               password:loginForm.elements["password"].value
           }
        
           fetch("/auth/login",{
               method:"POST",
               headers:{
                   "Content-Type":"application/json",
                   "Accept":"application/json",
               },
               body:JSON.stringify(loginObj)
           }).then(res=>res.json())
           .then(data=>{
          
                console.log(data)
                if(data.error){
                let elem= document.querySelector("#loginFormP")
                elem.innerHTML=JSON.stringify(data.error)
                 return
                }
                localStorage.setItem("AuthAccessToken", data.accessToken)
                localStorage.setItem("AuthRefreshToken", data.refreshToken)
                location.href="/"
           })
           
       })
       const forgetPassword=document.querySelector("#forgetPassword")
   
       forgetPassword.addEventListener("click",forgetPassordFunction)
         
            
    }
    const  setNewPassword=(id)=>{
      
        mainContainer.innerHTML=""
        mainContainer.insertAdjacentHTML("afterbegin",`
        <div class="container px-2 pt-5 ">
         
             <form method="POST" action="/auth/login" id="resetPassword" class="px-3">
               <p id="resetPasswordP"></p>
               <div class="form-group pt-5">
                   <label for="exampleInputEmail1">New Password</label>
                   <input name="password" type="password" class="form-control"  placeholder="Enter new password">
               </div>
               <input type="hidden" value="${ id }" name="id">
                          
               
               <button type="submit" class="btn btn-primary">Login</button>
             
           </form>
        
       `)
       const resetPassword=document.querySelector("#resetPassword")
       resetPassword.addEventListener("submit", (e)=>{
               e.preventDefault()
             
               let resetObj={
                     id:resetPassword.elements["id"].value,
                     password:resetPassword.elements["password"].value
               }
            
               fetch("/auth/reset",{
                   method:"PUT",
                   headers:{
                       "Content-Type":"application/json",
                       "Accept":"application/json",
                   },
                   body:JSON.stringify(resetObj)
               }).then(res=>res.json())
               .then(data=>{
              
                    console.log(data.error)
                    if(data.error){
                    let elem= document.querySelector("#resetPasswordP")
                    elem.innerHTML=JSON.stringify(data.error)
                     return
                    }
                    location.href="/"
               })
               
           })
        
               
         
           
        }
    const verifyEmail=(id)=>{
        mainContainer.innerHTML=""
       
        let   html=`
            <form id="verifyEmail">
            <p id="verifyEmailP"></p>
            <p>Your code  <input name="code" ></p>
                <input type="hidden" name="userId" value='`+id+`'>
                
                <input type="submit" >
            </form>
            `
          
        
        mainContainer.insertAdjacentHTML("afterbegin",html)
        const verifyEmail=document.querySelector("#verifyEmail")
         verifyEmail.addEventListener("submit", (e)=>{
      
            e.preventDefault()
        
               let infoObj={
                   code:verifyEmail.elements["code"].value,
                   userId:verifyEmail.elements["userId"].value,
               }
                       
              
            fetch(`/auth/verify/`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json",

                },
                body:JSON.stringify(infoObj)
            }).then(res=>res.json())
            .then(data=>{
                   console.log(data)
                if(data.error){
                   let elem= document.querySelector("#verifyEmailP")
                   elem.innerHTML=JSON.stringify(data.error)
                   return
                }
                location.href="/"
                   
             
             
            })
            
        })
      
    }
    const verifyEmailReset=(id)=>{
        mainContainer.innerHTML=""
     
        let   html=`
            <form id="verifyEmail">
            <p id="verifyEmailP"></p>
            <p>Your code  <input name="code" ></p>
                <input type="hidden" name="userId" value='`+id+`'>
                
                <input type="submit" >
            </form>
            `
          
        
        mainContainer.insertAdjacentHTML("afterbegin",html)
        const verifyEmail=document.querySelector("#verifyEmail")
         verifyEmail.addEventListener("submit", (e)=>{
      
            e.preventDefault()
         
               let infoObj={
                   code:verifyEmail.elements["code"].value,
                   userId:verifyEmail.elements["userId"].value,
                   
               }
                       
              
            fetch(`/auth/verify/`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json",

                },
                body:JSON.stringify(infoObj)
            }).then(res=>res.json())
            .then(data=>{
           console.log("r",data)
       
                if(data.error){
                   let elem= document.querySelector("#verifyEmailP")
                   elem.innerHTML=JSON.stringify(data.error)
                   return
                }
                setNewPassword(data.id)
               
             
            })
            
        })
      
    }

    const registerFunction=()=>{
        mainContainer.innerHTML=""
        mainContainer.insertAdjacentHTML("afterbegin",`
        <div class="container px-2 pt-5 "> 
            <form id="registerForm" class="px-3">
            <p id="registerFormP"></p>

            <div class="form-group ">
                <label>Username</label>
                <input type="text" name="username" class="form-control" value="">
                <span class="help-block"></span>
            </div> 
            <div class="form-group ">
                <label>Email</label>
                <input type="text" name="email" class="form-control" value="">
                <span class="help-block"></span>
            </div>    
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" class="form-control" value="">
                <span class="help-block"></span>
            </div>
    
            
            <div class="form-group">
                <input type="submit" class="btn btn-primary" value="Submit">
                <input type="reset" class="btn btn-default" value="Reset">
                
            </div>
           
        </form>
        
        <button id="cancelRegisterButton" class="btn btn-primary">Cancel</button>
    </div>
        `)
        const registerForm=document.querySelector("#registerForm")
        registerForm.addEventListener("submit", (e)=>{
            
            e.preventDefault()
            let registerObj={
                username:registerForm.elements["username"].value,
                email:registerForm.elements["email"].value,
                password:registerForm.elements["password"].value
            }
            fetch("/auth/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json",
                },
                body:JSON.stringify(registerObj)
            }).then(res=>res.json())
            .then(data=>{
           
                if(data.error){
                let elem= document.querySelector("#registerFormP")
                elem.innerHTML=JSON.stringify(data.error)
                 return
                }
                verifyEmail(data.id)
             
            })
            
        })
   
        
          
            let cancelRegisterButton=document.querySelector("#cancelRegisterButton")
                cancelRegisterButton.addEventListener("click",()=>{
                    location.href="/"
                })   
            }
        





    