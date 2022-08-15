'use strict';

function readTodo(todo, request, response) {
  todo.read()
    .then(todos => {
      const id = request.params.id;
      const _todo = todo.getTodo(todos, id);
      response.json({ todo: _todo });
      response.end();
    })
    .catch(({ message }) => {
      response.status(500);
      response.json({ error: message });
    });
};

module.exports = readTodo;
