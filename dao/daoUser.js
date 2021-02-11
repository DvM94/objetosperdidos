const User = require("../models/User")
const mailer = require("../modules/mailer")
const bcrypt = require("bcrypt")

const daoUser = {}

//Guardar
daoUser.save = function save(user) {
  return new Promise((resolve, reject) => {
    let member = new User(user)
    member.save()
      .then(member => {
        mailer.send(member, "Registro usuario nuevo")
        resolve(member)
      })
      .catch(error => reject(error))
  })
}

//Buscar
daoUser.findByEmail = function findByEmail(email) {
  return new Promise((resolve, reject) => {
    resolve(User.findOne({ email: email }))
  })
}

daoUser.findById = function findById(id) {
  return new Promise((resolve, reject) => {
    resolve(User.findById(id))
  })
}

//Validar
daoUser.validateUser = function validateUser(id) {
  return new Promise((resolve, reject) => {
    resolve(User.findByIdAndUpdate(id, { active: true }))
  })
}

//Acceder
daoUser.login = function login(credentials) {
  return new Promise((resolve, reject) => {
    daoUser.findByEmail(credentials.email)
      .then(async member => {
        if (member == null) {
          credentials.noEmail = true
          resolve(credentials)
        } else if (member.active == false) {
          member.noActivate = true
          resolve(member)
        } else {
          let response = await bcrypt.compare(credentials.password, member.password)
          if (response == false) {
            member.wrongPassword = true
            resolve(member)
          }
          else resolve(member)
        }
      })
  })
}

//Enviar mail de cambio de contraseña
daoUser.sendMailChangePassword = function sendMailChangePassword(email) {
  daoUser.findByEmail(email)
    .then(member => {
      mailer.send(member, "Cambio de contraseña")
    })
}

//Cambiar de contraseña
daoUser.changePassword = function changePassword(user) {
  return new Promise((resolve, reject) => {
    let member = new User(user)
    let error = {}
    error = member.validateSync()
    if (error == undefined) {
      bcrypt.hash(user.password, 10)
        .then(hash => { resolve(User.findOneAndUpdate({ email: user.email }, { password: hash })) })
    }
    else reject(error)
  })
}

//Cambiar datos perfil
daoUser.changeProfile = function changeProfile(user) {
  return new Promise((resolve, reject) => {
    let member = new User(user)
    let error = {}
    error = member.validateSync()
    if (error.errors.name == undefined && error.errors.phone == undefined) {
      User.findOneAndUpdate({ email: user.email }, { name: user.name, phone: user.phone })
        .then(() => {
          resolve(member)
        })
    }
    else reject(error)
  })
}

//Eliminar perfil
daoUser.deleteUser = function deleteUser(email) {
  return new Promise((resolve, reject) => {
    resolve(User.findOneAndDelete({ email: email }))
  })
}

module.exports = daoUser