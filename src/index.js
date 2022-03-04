const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  if (!users.some(user => user.username == username)) {
    return response.status(404).send({ error: 'User does not exist' })
  }
  return next();
}

app.post('/users', (request, response) => {

  const { name, username } = request.body;
  id = uuidv4();
  todos = [];

  const user = {
    id,
    name,
    username,
    todos
  };

  if (users.some(user => user.username == username)) {
    return response.status(400).send({ error: 'Username already exists' });
  } else {
    users.push(user);
    return response.status(201).send(user);
  }

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const userTodos = (users.find(user => user.username == username)).todos;
  return response.status(200).send(userTodos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;
  const { username } = request.headers;
  const id = uuidv4();

  const todo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  const user = users.find(user => user.username == username);

  user.todos.push(todo);

  return response.status(201).send(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { username } = request.headers;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const user = users.find(user => user.username == username);
  const todo = user.todos.find(todo => todo.id == id);

  if (!todo) {
    return response.status(404).send({ error: 'To Do does not exist'});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  response.status(200).send(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find(user => user.username == username);
  const todo = user.todos.find(todo => todo.id == id);

  if (!todo) {
    return response.status(404).send({ error: 'To Do does not exist'});
  }

  todo.done = true;

  response.status(200).send(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find(user => user.username == username);
  const todo = user.todos.find(todo => todo.id == id);

  if (!todo) {
    return response.status(404).send({ error: 'To Do does not exist'});
  }

  user.todos.splice(user.todos.indexOf(todo), 1);

  return response.status(204).send();
});

module.exports = app;