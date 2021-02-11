const express = require("express")
const rtMain = express.Router()

//Rutas
rtMain.get("/",function(req,res){
  res.render("general/home",{
    title:"Home"
  })
})

module.exports=rtMain