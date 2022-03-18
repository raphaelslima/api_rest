require('dotenv').config()
// Configurações iniciais

const express = require('express')
const app = express()

const mongoose = require('mongoose')

const port = 3000

// Definir o tipo de resposta que teremos na API
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

// Primeira rota
app.get('/', (req, res) => {
  return res.json({ message: 'API rodando' })
})

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@apicluster.9ufvu.mongodb.net/apirest?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('API conectado ao DB')
    // Definir a porta que será ouvida a aplicação
    app.listen(port, () => {
      console.log(`API rodando: http://localhost:3000/ `)
    })
  })
  .catch(err => {
    console.log(err)
  })
