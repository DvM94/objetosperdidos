const express = require("express")
const rtUser = express.Router()
const daoUser = require("../dao/daoUser")

//Rutas

//REGISTRARSE
rtUser.get("/nuevo", function (req, res) {
  res.render("user/formUser", {
    title: "Nuevo registro",
    value: "Registrar",
    link: "nuevo",
    userName: true
  })
})

rtUser.post("/nuevo", function (req, res) {
  daoUser.save(req.body)
    .then(() => {
      res.render("general/pending", {
        title: "Registro pendiente",
        register: true
      })
    })
    .catch(error => {
      let errors = {}
      if (error.code == 11000) errors.repeat = "Este email ya está registrado"
      if (error.errors) {
        errors.name = error.errors.name
        errors.phone = error.errors.phone
        errors.email = error.errors.email
        errors.password = error.errors.password
      }
      res.render("user/formUser", {
        title: "Nuevo registro",
        value: "Registrar",
        link: "nuevo",
        userName: true,
        errors,
        us: req.body
      })
    })
})

//Confirmar vía email
rtUser.get("/confirmado/:userid", function (req, res) {
  daoUser.validateUser(req.params.userid)
    .then(user => {
      res.render("general/booked", {
        title: "Registro correcto",
        user: user.name,
        message: "su cuenta ha sido verificada",
        button: "Acceder",
        link: "/usuario/acceso"
      })
    })
})

//ACCEDER
rtUser.get("/acceso", function (req, res) {
  res.render("user/formUser", {
    title: "Acceso",
    value: "Acceder",
    link: "acceso"
  })
})

rtUser.post("/acceso", function (req, res) {
  daoUser.login(req.body)
    .then(user => {
      if (user.noEmail || user.noActivate || user.wrongPassword)
        res.render("user/formUser", {
          title: "Acceso",
          value: "Acceder",
          link: "acceso",
          noEmail: user.noEmail,
          noActivate: user.noActivate,
          wrongPassword: user.wrongPassword,
          us: req.body
        })
      else {
        req.session.logged = true
        req.session.user = user.name
        req.session.phone = user.phone
        req.session.email = user.email
        res.redirect("/")
      }
    })

})

//CAMBIAR CONTRASEÑA
rtUser.get("/cambiarcontrasenia/:email", (req, res) => {
  daoUser.sendMailChangePassword(req.params.email)
  res.render("general/pending", {
    title: "Registro pendiente",
    changeEmail: true
  })
})

//Cambiar vía email
rtUser.get("/cambiocontrasenia/:userid", function (req, res) {
  daoUser.findById(req.params.userid)
    .then(user => {
      res.render("user/formUser", {
        title: "Cambio contraseña",
        value: "Cambiar contraseña",
        link: "cambiocontrasenia",
        name: user.name,
        phone: user.phone,
        email: user.email,
        userName: true,
        readonly: "readonly"
      })
    })
})

rtUser.post("/cambiocontrasenia", function (req, res) {
  daoUser.changePassword(req.body)
    .then(user => {
      res.render("general/booked", {
        title: "Cambio de contraseña correcta",
        message: "Su contraseña se ha modificado correctamente",
        button: "Acceder",
        link: "/usuario/acceso"
      })
    })
    .catch(error => {
      let errors = { password: error.errors.password }
      res.render("user/formUser", {
        title: "Cambio contraseña",
        value: "Cambiar contraseña",
        link: "cambiocontrasenia",
        userName: true,
        errors,
        us: req.body,
        readonly: "readonly"
      })
    })
})

//PERFIL
rtUser.get("/perfil", (req, res) => {
  res.render("user/profile", {
    title: "Perfil"
  })
})

//Modificar perfil
rtUser.post("/perfil", (req, res) => {
  daoUser.changeProfile(req.body)
    .then(user => {
      req.session.user = user.name
      req.session.phone = user.phone
      res.render("user/profile", {
        title: "Perfil",
        ok: "Cambios realizados correctamente"
      })
    })
    .catch(error => {
      let errors = {}
      errors.name = error.errors.name
      errors.phone = error.errors.phone
      res.render("user/profile", {
        title: "Perfil",
        errors
      })
    })
})

//Borrar perfil
rtUser.get("/confirmar", (req, res) => {
  res.render("user/confirmation", {
    title: "Borrar cuenta"
  })
})

rtUser.get("/eliminar", (req, res) => {
  daoUser.deleteUser(req.session.email)
    .then(()=>{
      req.session.destroy()
      res.render("general/pending", {
        title: "Cuenta borrada",
        deleteAcount: true
      })
    })
})

//Cerrar sesión
rtUser.get("/cerrarsesion", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

module.exports = rtUser