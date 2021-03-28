const mongoose=require('mongoose')

const token=mongoose.Schema({
    client_id: {
        type: String,
        required: true,
        
    }
})

const Token=mongoose.model('Tokenss',token)
module.exports={
  Token  
}
