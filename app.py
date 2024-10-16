from flask import Flask, jsonify, request

app = Flask(__name__)

# Datos de ejemplo
sabores = [
    {"id": 1, "nombre": "Chocolate", "precio": 50},
    {"id": 2, "nombre": "Vainilla", "precio": 45},
    {"id": 3, "nombre": "Fresa", "precio": 55},
]

pedidos = []

# Ruta para obtener todos los sabores
@app.route('/api/sabores', methods=['GET'])
def get_sabores():
    return jsonify(sabores)

# Ruta para obtener un sabor específico por ID
@app.route('/api/sabores/<int:id>', methods=['GET'])
def get_sabor(id):
    sabor = next((s for s in sabores if s["id"] == id), None)
    return jsonify(sabor) if sabor else ('', 404)

# Ruta para agregar un nuevo sabor
@app.route('/api/sabores', methods=['POST'])
def add_sabor():
    nuevo_sabor = request.get_json()
    nuevo_sabor['id'] = len(sabores) + 1
    sabores.append(nuevo_sabor)
    return jsonify(nuevo_sabor), 201

# Ruta para realizar un pedido
@app.route('/api/pedidos', methods=['POST'])
def realizar_pedido():
    nuevo_pedido = request.get_json()
    pedidos.append(nuevo_pedido)
    return jsonify(nuevo_pedido), 201

# Ruta para obtener todos los pedidos
@app.route('/api/pedidos', methods=['GET'])
def get_pedidos():
    return jsonify(pedidos)

if __name__ == '__main__':
    app.run(debug=True)
