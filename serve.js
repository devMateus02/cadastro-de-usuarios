const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", uri);
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db, usersCollection;

async function start() {
  try {
    await client.connect();
    db = client.db('users'); // substitua pelo nome real
    usersCollection = db.collection('users');
    console.log('Conectado ao MongoDB');
    
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error);
  }
}

start();

// Criar usuário
app.post('/usuarios', async (req, res) => {
  try {
    const { email, name, age } = req.body;

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado!' });
    }

    const result = await usersCollection.insertOne({ email, name, age: parseInt(age) });
    res.status(201).send(`Usuário ${name} cadastrado com sucesso.`);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).send('Erro interno no servidor');
  }
});

// Listar usuários
app.get('/usuarios', async (req, res) => {
  const users = await usersCollection.find().toArray();
  res.send(users);
});

// Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name, age } = req.body;
  await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { email, name, age: parseInt(age) } }
  );
  res.send(req.body);
});

// Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  await usersCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(`Usuário com ID ${id} deletado`);
});
