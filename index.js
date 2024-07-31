const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Conectar ao MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',  
  database: 'todolistDB'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Função para obter tarefas por status
function getTasksByStatus(status, callback) {
  const query = 'SELECT * FROM tasks WHERE status = ?';
  db.query(query, [status], callback);
}

// Rota principal - visualizar tarefas
app.get('/', (req, res) => {
  const statuses = ['Backlog', 'Fazer', 'Fazendo', 'Feito'];
  let tasks = {};
  
  let count = 0;

  statuses.forEach(status => {
    getTasksByStatus(status, (err, results) => {
      if (err) throw err;
      tasks[status] = results;
      count++;

      if (count === statuses.length) {
        res.render('list', { tasks });
      }
    });
  });
});

// Adicionar nova tarefa
app.post('/add', (req, res) => {
  const task = req.body.task;
  const query = 'INSERT INTO tasks (name, status) VALUES (?, ?)';
  db.query(query, [task, 'Backlog'], (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Atualizar status da tarefa
app.post('/update-status', (req, res) => {
  const taskId = req.body.id;
  const newStatus = req.body.status;
  const query = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.query(query, [newStatus, taskId], (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Atualizar nome da tarefa
app.post('/update-name', (req, res) => {
  const taskId = req.body.id;
  const taskName = req.body.name;
  const query = 'UPDATE tasks SET name = ? WHERE id = ?';
  db.query(query, [taskName, taskId], (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Deletar tarefa
app.post('/delete', (req, res) => {
  const taskId = req.body.id;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [taskId], (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Server started on port 3000');
});


// Douglas Alsino e Roberta Souza - Trabalho FDBE