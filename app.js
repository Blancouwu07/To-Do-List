const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Arreglo en memoria para almacenar las tareas
let tareas = [
    {
        titulo: "Comprar despensa",
        descripcion: "Ir al supermercado por los víveres de la semana",
        estado: "pendiente", // estados: pendiente, completada
        pasos: ["Hacer lista", "Llevar bolsas ecológicas", "Pagar"]
    },
    {
        titulo: "Estudiar Express",
        descripcion: "Aprender a crear rutas y usar middlewares",
        estado: "completada",
        pasos: ["Ver tutorial", "Escribir código", "Hacer API"]
    }
];

// 1. Obtener todas las tareas
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// 2. Obtener una tarea por nombre (título)
app.get('/tareas/buscar/:titulo', (req, res) => {
    const tituloBuscar = req.params.titulo.toLowerCase();
    const tarea = tareas.find(t => t.titulo.toLowerCase() === tituloBuscar);
    
    if (!tarea) {
        return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    res.json(tarea);
});

// 3. Obtener listado de tareas pendientes
app.get('/tareas/pendientes', (req, res) => {
    const pendientes = tareas.filter(t => t.estado === "pendiente");
    res.json(pendientes);
});

// 4. Obtener listado de tareas completadas
app.get('/tareas/completadas', (req, res) => {
    const completadas = tareas.filter(t => t.estado === "completada");
    res.json(completadas);
});

// 5. Agregar una nueva tarea
app.post('/tareas', (req, res) => {
    const { titulo, descripcion, estado, pasos } = req.body;

    // Validación básica
    if (!titulo || !descripcion) {
        return res.status(400).json({ mensaje: "El título y la descripción son obligatorios" });
    }

    const nuevaTarea = {
        titulo,
        descripcion,
        estado: estado || "pendiente", // por defecto pendiente si no se envía
        pasos: pasos || []
    };

    tareas.push(nuevaTarea);
    res.status(201).json({ mensaje: "Tarea agregada con éxito", tarea: nuevaTarea });
});

// 6. Actualizar una tarea existente (por título original)
app.put('/tareas/:titulo', (req, res) => {
    const tituloBuscar = req.params.titulo.toLowerCase();
    const index = tareas.findIndex(t => t.titulo.toLowerCase() === tituloBuscar);

    if (index === -1) {
        return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    const { titulo, descripcion, estado, pasos } = req.body;

    // Actualizamos solo los campos que vengan en el cuerpo del request
    tareas[index] = {
        ...tareas[index],
        titulo: titulo || tareas[index].titulo,
        descripcion: descripcion || tareas[index].descripcion,
        estado: estado || tareas[index].estado,
        pasos: pasos || tareas[index].pasos
    };

    res.json({ mensaje: "Tarea actualizada con éxito", tarea: tareas[index] });
});

// 7. Actualizar el estado de una tarea
app.patch('/tareas/:titulo/estado', (req, res) => {
    const tituloBuscar = req.params.titulo.toLowerCase();
    const tarea = tareas.find(t => t.titulo.toLowerCase() === tituloBuscar);

    if (!tarea) {
        return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    const { estado } = req.body;
    if (!estado || (estado !== "pendiente" && estado !== "completada")) {
        return res.status(400).json({ mensaje: "Estado inválido. Debe ser 'pendiente' o 'completada'" });
    }

    tarea.estado = estado;
    res.json({ mensaje: "Estado actualizado con éxito", tarea });
});

// 8. Eliminar una tarea específica
app.delete('/tareas/:titulo', (req, res) => {
    const tituloBuscar = req.params.titulo.toLowerCase();
    const index = tareas.findIndex(t => t.titulo.toLowerCase() === tituloBuscar);

    if (index === -1) {
        return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    const tareaEliminada = tareas.splice(index, 1);
    res.json({ mensaje: "Tarea eliminada con éxito", tarea: tareaEliminada[0] });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});