const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let sabores = [
    { id: 1, nombre: 'Chocolate', precio: 150 },
    { id: 2, nombre: 'Vainilla', precio: 120 },
];

// Obtener todos los sabores
app.get('/api/heladeria/sabores', (req, res) => {
    res.json(sabores);
});

// Agregar un nuevo sabor
app.post('/api/heladeria/sabores', (req, res) => {
    const nuevoSabor = {
        id: sabores.length + 1,
        nombre: req.body.nombre,
        precio: req.body.precio,
    };
    sabores.push(nuevoSabor);
    res.status(201).json(nuevoSabor);
});

// Actualizar un sabor existente
app.put('/api/heladeria/sabores/:id', (req, res) => {
    const { id } = req.params;
    const sabor = sabores.find(s => s.id === parseInt(id));
    
    if (!sabor) {
        return res.status(404).json({ error: 'Sabor no encontrado' });
    }
    
    sabor.nombre = req.body.nombre;
    sabor.precio = req.body.precio;
    res.json(sabor);
});

// Eliminar un sabor
app.delete('/api/heladeria/sabores/:id', (req, res) => {
    const { id } = req.params;
    const index = sabores.findIndex(sabor => sabor.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ message: 'Sabor no encontrado' });
    }

    sabores.splice(index, 1);
    res.status(200).json({ message: 'Sabor eliminado' });
});


app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
