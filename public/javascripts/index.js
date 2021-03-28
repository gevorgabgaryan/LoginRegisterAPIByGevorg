const mainContainer=document.querySelector("#mainContainer")
document.addEventListener("DOMContentLoaded",()=>{

    if(localStorage.getItem("AuthAccessToken")){
    
         fetch("/", {
             method: "POST",
             headers: {
               "content-type": "application/json",
               "Authorization": "Bearer " + localStorage.getItem("AuthAccessToken")
             }
           }).then(res=>res.json())
           .then(data=>{
  
            console.log("logf",data)
             if(data.error){
             if(data.error=="jwt expired"){
               refreshtoken()
               
               }else{
                
                 return
               }
             }else{
               console.log("logind",data)
               let {user}=data
               console.log(user)
               homeFunction(user) 
             }
              
           })
 }else{
   loginFunction()
 }

})


function refreshtoken(){
  
  fetch("/auth/token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("AuthRefreshToken")
    }
  }).then(res=>res.json())
  .then(data=>{

    if(data.error){
      loginFunction()
       
     return
    }
    localStorage.setItem("AuthAccessToken", data.accessToken)
    localStorage.setItem("AuthRefreshToken", data.refreshToken)
    console.log(data)
    let {user}=data
    console.log(user)
    homeFunction(user)
    
  })

}