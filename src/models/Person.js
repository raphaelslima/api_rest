const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  salary: {
    type: Number
  },
  approved: {
    type: Boolean
  }
})

const Person = new mongoose.model('Person', personSchema)

module.exports = Person
