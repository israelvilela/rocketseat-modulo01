const express = require("express");

const server = express();

server.use(express.json());

const users = ["Israel", "Rubens", "Samuel"];

// Middleware
server.use((req, res, next) => {
  console.log("Entrou no middleware.");
  next();
  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required." });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does't exists." });
  }

  req.user = user;

  return next();
}

//Query Params = ?teste=1
server.get("/users", (req, res) => {
  const nome = req.query.nome;

  return res.json(users);
});

//Route Params = /users/1
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

//Request Body = {'name': 'Israel', 'email': 'teste@gmail.com'}
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
