// app.js

const apiBaseUrl = 'http://localhost:3000/api/heladeria';

let saborParaActualizar = null; // Variable para almacenar el sabor que se va a actualizar

// Obtener todos los sabores de helado
function obtenerSabores() {
    fetch(`${apiBaseUrl}/sabores`)
        .then(response => response.json())
        .then(data => {
            console.log('Sabores disponibles:', data); // Agregar esta línea
            const saboresList = document.getElementById('sabores-list');
            saboresList.innerHTML = '';

            data.forEach(sabor => {
                const li = document.createElement('li');
                li.textContent = `${sabor.nombre} - $${sabor.precio}`;
                li.dataset.id = sabor.id; // Almacenar el ID en el elemento

                // Botón de actualización
                const btnActualizar = document.createElement('button');
                btnActualizar.textContent = 'Actualizar';
                btnActualizar.onclick = () => prepararActualizacion(sabor);
                li.appendChild(btnActualizar);

                // Botón de eliminación
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.onclick = () => eliminarSabor(sabor.id);
                li.appendChild(btnEliminar);

                saboresList.appendChild(li);
            });
        })
        .catch(error => console.error('Error al obtener sabores:', error));
}
// Agregar un nuevo sabor de helado
function agregarSabor() {
    const nuevoSabor = {
        nombre: document.getElementById('nuevo-sabor-nombre').value,
        precio: parseFloat(document.getElementById('nuevo-sabor-precio').value)
    };

    fetch(`${apiBaseUrl}/sabores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoSabor)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sabor agregado:', data);
        obtenerSabores(); // Actualizar la lista después de agregar
        resetForm(); // Resetear el formulario
    })
    .catch(error => console.error('Error al agregar sabor:', error));
}

// Preparar la actualización de un sabor
function prepararActualizacion(sabor) {
    saborParaActualizar = sabor; // Guardar el sabor seleccionado para actualizar
    document.getElementById('nuevo-sabor-nombre').value = sabor.nombre;
    document.getElementById('nuevo-sabor-precio').value = sabor.precio;
    document.getElementById('agregar-sabor-btn').textContent = 'Actualizar Sabor'; // Cambiar el botón
}

// Actualizar un sabor existente
function actualizarSabor() {
    if (!saborParaActualizar) return; // Si no hay un sabor para actualizar, salir

    const saborActualizado = {
        nombre: document.getElementById('nuevo-sabor-nombre').value,
        precio: parseFloat(document.getElementById('nuevo-sabor-precio').value)
    };

    fetch(`${apiBaseUrl}/sabores/${saborParaActualizar.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(saborActualizado)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sabor actualizado:', data);
        obtenerSabores(); // Actualizar la lista
        resetForm(); // Resetear el formulario
        saborParaActualizar = null; // Limpiar la variable
        document.getElementById('agregar-sabor-btn').textContent = 'Agregar Sabor'; // Restablecer el texto del botón
    })
    .catch(error => console.error('Error al actualizar sabor:', error));
}

// Eliminar un sabor
function eliminarSabor(id) {
    fetch(`${apiBaseUrl}/sabores/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al eliminar sabor: ${response.statusText}`);
        }
        return response.json();
    })
    .then(() => {
        console.log('Sabor eliminado');
        obtenerSabores(); // Actualizar la lista
    })
    .catch(error => console.error('Error al eliminar sabor:', error));
}

const swagger = document.getElementById("swagger");



// Reiniciar el formulario
function resetForm() {
    document.getElementById('nuevo-sabor-nombre').value = '';
    document.getElementById('nuevo-sabor-precio').value = '';
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    obtenerSabores();

    const agregarBtn = document.getElementById('agregar-sabor-btn');
    agregarBtn.addEventListener('click', () => {
        if (saborParaActualizar) {
            actualizarSabor(); // Llamar a la función de actualizar
        } else {
            agregarSabor(); // Llamar a la función de agregar
        }
    });
});
