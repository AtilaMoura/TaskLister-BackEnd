const express = require('express')
const mysql = require('mysql2');
const cors = require('cors')

//opção de conexição com myql
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bd_tasks'
})

const app = new express();



app.listen(3000, () => {
    console.log('serv iniciado!');

});

//cors - permissão de resposta para qualquer chamada
app.use(cors());
app.use(express.json());

// rotas
app.get("/", (req, res) => {
    //res.send('Ola Mundo!');
    connection.query("SELECT COUNT(*) users FROM users", (err, results) => {
        if (err) {
            res.send('MySQL connection error', err.message)
        }

        res.send('MySQL connection OK!');
    })
});

app.get("/user/:id", (req, res) => {
    connection.query("SELECT idusers, username, created_at FROM users WHERE idusers = ?", [req.params.id], (err, results) => {
        if (err) {
            res.send('MySQL connection error', err.message)
        }

        res.json(results);
    })

});

app.get("/user/:id/tasks/:status", (req, res) => {
    let select_task = ''
    if (req.params.status == 'all') {
        select_task = "SELECT * FROM tasks WHERE id_users = ?"
        list_parament = [req.params.id]
    } else {
        select_task = "SELECT * FROM tasks WHERE id_users = ? AND task_status = ?"
        list_parament = [req.params.id, req.params.status]
    }
    connection.query(select_task, list_parament, (err, results) => {
        if (err) {
            res.send('MySQL connection error', err.message)
        }

        res.json(results);
    })
});

app.post("/user/:id/task/uptade_status", (req, res) => {
    //console.log(req.params.id);
    //console.log(req.body.id_task);
    //console.log(req.body.status);
    connection.query("UPDATE tasks SET task_status = ?, updated_at = NOW() WHERE id = ?", [req.body.status, req.body.id_task], (err, results) => {
        if (err) {
            res.send('MySQL connection error', err.message)
        }
    })
    res.json('ok');
});

app.post("/user/:id/task/new_task/", (req, res) => {
    connection.query("INSERT INTO tasks VALUES(0, ?, ?, 'new', NOW(), NOW())", [req.body.id_user, req.body.task_text], (err, results) => {
        if (err) {
            res.send('MySQL connection error', err.message)
        }
    })
    res.json('ok');
});

app.get("/user/task/get_task/:id_task", (req, res) => {

    connection.query("SELECT * FROM tasks WHERE id = ?", [req.params.id_task], (err, results) => {
        if (err) {
            res.send('MySQL connection error', err.message)
        }
        res.json(results);
    })
});

app.post("/user/task/update_task", (req, res) => {
    connection.query("UPDATE tasks SET task_text = ?, updated_at = NOW() WHERE id = ?", [req.body.task_text, req.body.id_task], (err, results) => {
        if (err) {
            res.send('MySQL connection error', err.message)
        }
    })
    res.json('ok');
});

app.get("/user/task/delete_task/:id_task", (req, res) => {

    connection.query("DELETE FROM tasks WHERE id = ?", [req.params.id_task], (err, results) => {
        if (err) {
            res.send('MySQL connection error', err.message)
        }
        res.json(results);
    })
});