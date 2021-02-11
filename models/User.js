const mongoose = require("mongoose")
const { Schema } = mongoose
const bcrypt = require("bcrypt")

const schemaUser = new Schema({
  name: {
    type: String,
    required: [true, "El nombre no puede ir vacío"],
    validate: {
      validator: function (name) { return /^[a-zÀ-ÿ\u00f1\u00d1\s]{2,}$/i.test(name) },
      message: "El nombre no es válido"
    }
  },
  phone: {
    type: String,
    required: [true, "El teléfono no puede ir vacío"],
    validate: {
      validator: function (phone) { return /(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/i.test(phone) },
      message: "El teléfono no es válido"
    }
  },
  email: {
    type: String,
    required: [true, "El email no puede ir vacío"],
    index: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (email) { return /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email) },
      message: "El email no es válido"
    }
  },
  password: {
    type: String,
    required: [true, "La contraseña no puede ir vacía"],
    validate: {
      validator: function (password) { return /^[a-zÀ-ÿ0-9\u00f1\u00d1\s]{6,}$/i.test(password) },
      message: "La contraseña ha de tener un mínimo de 6 letras o números"
    },
  },
  active: { type: Boolean, default: false }
})

schemaUser.pre("save", function (next) {
  bcrypt.hash(this.password, 10)
    .then(hash => {
      this.password = hash
      next()
    })
})

class User {

}

schemaUser.loadClass(User)
module.exports = mongoose.model("User", schemaUser)