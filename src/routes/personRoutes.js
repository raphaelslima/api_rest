const router = require('express').Router()
const bcrypt = require('bcrypt')

// Importações de models
const Person = require('../models/Person')

// Create
router.post('/', async (req, res) => {
  // Captura os dados da requisição
  const { name, password, salary, approved } = req.body

  // Verifica se os campos obrigatórios foram preenchidos
  if (!name || !password) {
    return res
      .status(422)
      .json({ error: 'Nome e senha são campos obrigatórios' })
  }

  //Verifica se o usiário já existe
  const checkUserExist = await Person.findOne({ name: name })

  if (checkUserExist) {
    return res.status(422).json({ error: 'Usuário já exste' })
  }

  // Cryptografa a senha
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  // Salva os dados em um objeto
  const person = {
    name: name,
    password: passwordHash,
    salary: salary,
    approved: approved
  }

  // Salva no banco
  try {
    const newPerson = await Person.create(person)

    return res.status(201).json({
      error: null,
      message: 'Cadastro realizado com sucesso',
      newPerson: newPerson
    })
  } catch (error) {
    return res.status(400).json({ error })
  }
})

// Read All
router.get('/all', async (req, res) => {
  try {
    const people = await Person.find({})

    return res
      .status(200)
      .json({ error: null, message: 'Usuários encontrados', people: people })
  } catch (error) {
    return res.status(400).json({ error })
  }
})

// Read One
router.get('/:id', async (req, res) => {
  // Captura o id da requisição
  const id = req.params.id

  try {
    const person = await Person.findOne({ _id: id })

    return res
      .status(200)
      .json({ error: null, message: 'Usuário encontrado', person: person })
  } catch (error) {
    res.status(400).json({ error })
  }
})

// Update
router.patch('/:id', async (req, res) => {
  //Captura os dados dos paramêtros da requisição
  const id = req.params.id

  // Captura os dados do corpo da requisição
  const name = req.body.name
  const password = req.body.password
  const salary = req.body.salary
  const approved = req.body.approved

  // Verifica se os campos obrigatorios foram preenchidos
  if (name == null || password == null) {
    return res
      .status(400)
      .json({ error: 'Os campos de nome e passwaord são obrigatórios' })
  }

  //Verifica se o usuário existe
  const checkPersonExist = await Person.findOne({ _id: id })

  if (!checkPersonExist) {
    return res.status(422).json({ message: 'Usuário não encontrado!' })
  }

  // Cryptografa a nova senha:
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  // Cria objeto com os dados atualizados
  const person = {
    name: name,
    password: passwordHash,
    salary: salary,
    approved: approved
  }

  try {
    const updatedPerson = await Person.updateOne({ _id: id }, person)

    res.status(200).json({
      error: null,
      message: 'Cadastro atualizado com sucesso',
      updatedPerson
    })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  const id = req.params.id

  const person = await Person.findOne({ _id: id })

  if (!person) {
    res.status(422).json({ message: 'Usuário não encontrado!' })
    return
  }

  try {
    await Person.deleteOne({ _id: id })

    return res
      .status(200)
      .json({ error: null, message: 'Usuário deletado com sucesso' })
  } catch (error) {
    return res.status(400).json({ error })
  }
})
module.exports = router
