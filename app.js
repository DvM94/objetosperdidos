//servidor
const express = require("express")
const session = require("express-session")
const app = express()
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 3000
//enrutadores
const rtMain = require("./routes/rtMain")
const rtObject = require("./routes/rtObject")
const rtUser = require("./routes/rtUser")
//base de datos MongoDB
const connection = require("./connection")

//motor de plantillas handlebars
var exphbs = require("express-handlebars")
app.engine(".hbs",exphbs({
  extname: ".hbs"
}))
app.set("view engine", "hbs")

//middlewares
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended:true}))
app.use(fileUpload())
app.use(express.json())
app.use(session({
  secret: "mysecretkey",
  resave: false,
  saveUninitialized:true
}))

//middleware para rutas privadas
let privateRutes=[
  "/objeto/nuevo",
  "/usuario/perfil",
  "/usuario/confirmar",
  "/usuario/eliminar",
  "/usuario/cerrarsesion"
]
app.use((req,res,next)=>{
  if(req.session.logged){
    res.locals.session = req.session
    next()
  }else{
    if(privateRutes.indexOf(req.url)!=-1)
      res.render("user/formUser", {
        title: "Acceso",
        value: "Acceder",
        link: "acceso"
      })
    else
      next()
  }
})

//conexión a mongo db
connection.on("error",console.error.bind(console,"Error al conectar a mongo"))
connection.once("open",()=>console.log("Conexión con Mongo OK!"))

//enroutador principal
app.use("/",rtMain)
app.use("/objeto",rtObject)
app.use("/usuario",rtUser)

//404 handler
app.use((req, res, next) => res.status(404).render('general/error',{title:"No existe"}))

//arrancar el servidor
app.listen(port,(err)=>{console.log(`Server run on port ${port}`)})