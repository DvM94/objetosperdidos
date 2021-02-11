const mongoose = require("mongoose")
const {Schema} = mongoose

const schemaObject = new Schema({
  email: {
    type:String,
    required: [true,"El nombre no puede ir vacío"],
    validate: {
      validator: function (email) { return /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email) },
      message: "El nombre no es válido"
    }
  },
  phone: {
    type:String,
    required: [true,"El teléfono no puede ir vacío"],
    validator: function (phone) { return /(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/i.test(phone) },
    message: "El teléfono no es válido"
  },
  title: {
    type:String,
    required: [true,"El título no puede ir vacío"],
    validator: function (title) { return /^[a-zÀ-ÿ0-9\u00f1\u00d1\s]{4,}$/i.test(title) },
    message: "El título no es válido"
  },
  location: {
    type:String,
    required: [true,"La localización no puede ir vacía"],
    validator: function (location) { return /^[a-zÀ-ÿ0-9\u00f1\u00d1\s]{4,}$/i.test(location) },
    message: "La localización no es válida"
  },
  description: {
    type:String,
    validator: function (description) { 
      if(description.length>100) return false 
      else return true
    },
    message: "La descripción no puede superar los 100 caracteres"
  },
  image: {
    type:String,
    required: [true,"No ha subido una imagen"]
  },
  date: {type:String, required:true}
})

class Object {

  set today(today){
    this.date = today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear()
  }

}

schemaObject.loadClass(Object)
module.exports = mongoose.model("Object",schemaObject)