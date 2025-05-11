const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient()
const express = require('express')
const cors = require('cors')
const port = 3000
const app = express()
const bodyParser = require('body-parser');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/usuarios', async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: parseInt(req.body.age)  // important: Prisma expects age as Int
      }
    });

    res.status(201).send(`Usuário ${newUser.name} cadastrado com sucesso.`);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);  // ← this is key
    res.status(500).send('Erro interno no servidor');
  }
});


app.get('/usuarios', async (req, res) => {
   const user =  await prisma.user.findMany()

   res.send(user)
})


app.put('/usuarios/:id', async (req, res) => {
   await prisma.user.update(
          {
            where: {
                id: req.params.id
            },
            data: {
               email: req.body.email,
               name: req.body.name,
               age: req.body.age
           }
          }
    )

    res.send(req.body)
})

app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
          where: {
                id: req.params.id
            }
          }

    )
    
})

app.listen(port, () => {
    console.log(`Este servidor está rodando na porta: ${port}`);
});
