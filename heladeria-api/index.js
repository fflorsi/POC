const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// OpenAPI (Swagger) Specification setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Heladería API',
      version: '1.0.0',
      description: 'API para gestionar sabores y pedidos de una heladería',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./index.js'], // Definición de rutas para generar la documentación
};

const swaggerSpec = swaggerJsdoc(options);

// Rutas

/**
 * @swagger
 * components:
 *   schemas:
 *     Sabor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *           example: Chocolate
 *     Pedido:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         sabores:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Sabor'
 *         cliente:
 *           type: string
 *           example: Juan Pérez
 */

/**
 * @swagger
 * /sabores:
 *   get:
 *     summary: Obtener todos los sabores disponibles
 *     responses:
 *       200:
 *         description: Lista de sabores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sabor'
 */

let sabores = [
  { id: 1, nombre: 'Chocolate' },
  { id: 2, nombre: 'Vainilla' },
  { id: 3, nombre: 'Frutilla' },
  { id: 4, nombre: 'Limón' },
  { id: 5, nombre: 'Menta' },
];

// Obtener todos los sabores
app.get('/sabores', (req, res) => {
  res.json(sabores);
});

/**
 * @swagger
 * /sabores:
 *   post:
 *     summary: Agregar un nuevo sabor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sabor'
 *     responses:
 *       201:
 *         description: Sabor creado
 */

app.post('/sabores', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del sabor es requerido.' });
  }

  const nuevoSabor = {
    id: sabores.length + 1,
    nombre,
  };

  sabores.push(nuevoSabor);
  res.status(201).json(nuevoSabor);
});

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido creado
 *       400:
 *         description: Error en la solicitud
 */

let pedidos = [];

app.post('/pedidos', (req, res) => {
  const { sabores, cliente } = req.body;

  // Validación básica
  if (!sabores || !Array.isArray(sabores) || sabores.length === 0) {
    return res.status(400).json({ error: 'Se deben proporcionar al menos un sabor.' });
  }

  if (!cliente) {
    return res.status(400).json({ error: 'El nombre del cliente es requerido.' });
  }

  const pedido = {
    id: pedidos.length + 1,
    sabores: sabores.map(id => sabores.find(s => s.id === id)),
    cliente,
  };

  pedidos.push(pedido);
  res.status(201).json(pedido);
});

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Obtener todos los pedidos realizados
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
app.get('/pedidos', (req, res) => {
  res.json(pedidos);
});

// Swagger UI para visualizar la documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación en http://localhost:${PORT}/api-docs`);
});
