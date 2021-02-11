const Object = require("../models/Object")

const daoObjects = {}

//Guardar
daoObjects.save = function save(object, photo) {
  return new Promise((resolve, reject) => {
    object.today = new Date()
    let obj = new Object(object)
    if (photo == null) obj.image = ""
    else obj.image = `../img/objects/${photo.image.name}`
    obj.save()
      .then(obj => {
        photo.image.mv(`./public/img/objects/${photo.image.name}`, err => { if (err) return res.status(500).send({ message: err }) })
        resolve(obj)
      })
      .catch(error => reject(error))
  })
}

//Listar
daoObjects.show = function show() {
  return new Promise((resolve, reject) => {
    resolve(Object.find().lean())
  })
}

daoObjects.showByTitle = function showByTitle(title) {
  return new Promise((resolve, reject) => {
    resolve(Object.find({title:{ $regex: `.*${title}.*`, $options:'i' }}).lean())
  })
}

module.exports = daoObjects