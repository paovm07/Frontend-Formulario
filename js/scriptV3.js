var botonGuardar = document.getElementById("btnGuardar");
var botonActualizar = document.getElementById("btnActualizar");
var botonEliminar = document.getElementById("btnEliminar");

botonGuardar.disabled = false;
botonActualizar.disabled = true;
botonEliminar.disabled = true;

let formulario = document.getElementById("formulario");
let campos = formulario.querySelectorAll("input, select");

// Efectos visuales de enfoque en los campos
campos.forEach(campo =>{
    campo.addEventListener("focus", function(){
        this.style.backgroundColor = "gray";
    });

    campo.addEventListener("blur", function(){
        this.style.backgroundColor = "white";
    });
});

let personas = [];

// ==========================================
// 1. OBTENER PERSONAS AL CARGAR LA PÁGINA (GET)
// ==========================================
// Esto soluciona que la tabla de abajo muestre lo que hay en la Base de Datos
function cargarPersonas() {
    fetch('http://localhost:3000/personas')
        .then(respuesta => respuesta.json())
        .then(data => {
            personas = data; // Guardamos los datos reales del servidor
            mostrarPersona(); // Pintamos la tabla
        })
        .catch(error => console.error("Error al cargar las personas:", error));
}

// Ejecutamos la función apenas cargue el script
cargarPersonas();


// ==========================================
// 2. GUARDAR PERSONA EN EL BACKEND Y MYSQL (POST)
// ==========================================
botonGuardar.addEventListener("click", function(){

    let persona = {};

    // Recorremos los campos para armar el objeto con los datos del formulario
    campos.forEach(campo =>{
        persona[campo.id] = campo.value;
    });

    // Validamos que los campos obligatorios no estén vacíos antes de enviar
    if (!persona.numeroDocumento || !persona.nombres) {
        alert("Por favor completa al menos el documento y los nombres.");
        return;
    }

    console.log("Enviando objeto al servidor:", persona);

    // Petición fetch hacia tu API de Node.js
    fetch('http://localhost:3000/personas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(persona) // Convertimos el objeto JS a formato JSON
    })
    .then(respuesta => respuesta.json())
    .then(datosGuardados => {
        console.log("Respuesta del servidor:", datosGuardados);
        
        alert("¡Persona guardada exitosamente en la base de datos!");
        
        // Limpiamos los campos del formulario visualmente
        campos.forEach(campo => {
            campo.value = "";
        });

        // Recargamos la tabla consultando de nuevo al servidor para ver el registro guardado
        cargarPersonas();
    })
    .catch(error => {
        console.error("Error al conectar con el servidor:", error);
        alert("Hubo un error al conectar con el servidor.");
    });
});


// ==========================================
// 3. FUNCIÓN PARA PINTAR LA TABLA VISUAL
// ==========================================
let tabla = document.getElementById("tablaPersona");

function mostrarPersona(){
    tabla.innerHTML = ""; // Limpiamos la tabla antes de volver a pintarla

    personas.forEach(persona => {
        let fila = tabla.insertRow();

        let celdatipoDocumento = fila.insertCell();
        celdatipoDocumento.textContent = persona.tipoDocumento;

        let numeroDocumento = fila.insertCell();
        numeroDocumento.textContent = persona.numeroDocumento;

        let nombres = fila.insertCell();
        nombres.textContent = persona.nombres;

        let apellidos = fila.insertCell();
        apellidos.textContent = persona.apellidos;

        let fechaNacimiento = fila.insertCell();
        fechaNacimiento.textContent = persona.fechaNacimiento;

        let correo = fila.insertCell();
        correo.textContent = persona.correo;

        let direccion = fila.insertCell();
        direccion.textContent = persona.direccion;

        let ciudad = fila.insertCell();
        ciudad.textContent = persona.ciudad;

        let telefono = fila.insertCell();
        telefono.textContent = persona.telefono;
    });
}