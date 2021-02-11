const express = require("express")
const rtObject = express.Router()
const daoObjects = require("../dao/daoObjects")

//Rutas

rtObject.get("/nuevo",function(req,res){
  res.render("object/form", {
    title: "Nuevo registro"
  })
})

rtObject.post("/nuevo", function (req, res) {
  daoObjects.save(req.body, req.files)
    .then(obj=>{
      res.render("general/booked", {
        title: "Registro correcto",
        message: "El objeto se ha registrado correctamente",
        button: "Registrar otro objeto",
        link: "/objeto/nuevo"
      })
    })
    .catch(error=>{
      let errors = {}
      errors.email = error.errors.email
      errors.phone = error.errors.phone
      errors.title = error.errors.title
      errors.location = error.errors.location
      errors.description = error.errors.description
      errors.image = error.errors.image
      res.render("object/form", {
        title: "Nuevo registro",
        errors,
        obj: req.body
      })
    })
})

rtObject.get("/lista", async function (req, res) {
  let lostObjects = await daoObjects.show()
  res.render("object/list", {
    title: "Registro",
    lostObjects
  })
})

rtObject.post("/lista/filtrar", function (req, res) {
  daoObjects.showByTitle(req.body.title)
    .then(list=>{
        res.json(list)
    })
})

module.exports = rtObject