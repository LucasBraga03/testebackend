const express = require("express")
const lista = require("./cursos.json")
const jwt = require('jsonwebtoken')
const SECRET = 'lucastools'

const app = express()
app.use(express.json())

app.listen(3000, () => {
    console.log('rodando na porta 3000');
})

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();

        req.userId = decoded.userId; next();
    })
}

app.post('/login', (req, res) => {

    if (req.body.user === 'lucas' && req.body.password === '123') {
        const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: 500 })
        return res.json({ auth: true, token });
    }

    res.status(401).end();
})

app.get('/courses', verifyJWT, (req, res) => {
    res.json(lista)
})

app.get('/courses/:id', verifyJWT, (req, res) => {
    const course = lista.find(course => course.id === Number(req.params.id));
    if (course) return res.status(200).json(course);
    return res.status(400).json('nenhum curso encontrado')
})

app.post('/courses', verifyJWT, (req, res) => {
    const course = [];
    course.push(...lista, req.body);
    return res.json(course)
})

app.delete('/courses/:id', verifyJWT, (req, res) => {

    const dados = lista.find(dados => dados.id === Number(req.params.id));
    if (dados) {
        const { id } = req.params;
        const course = lista.findIndex(curso => curso.id = id);
        lista.splice(course)
        return res.status(204).send();

    }
    return res.status(400).json('nenhum curso encontrado')
})

app.put('/courses/:id', verifyJWT, (req, res) => {
    const dados = lista.find(dados => dados.id === Number(req.params.id));
    if(dados) { 
    const { id } = req.params;
    const { valor_original, turno } = req.body;
    const course = { id, valor_original, turno }
    const projectIndex = lista.findIndex(curso => curso.id = id);
    lista[projectIndex] = course;
    return res.json(course);
    }

    return res.status(400).json('nenhum curso encontrado')

})