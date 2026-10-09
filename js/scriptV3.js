var botonGuardar = document.getElementById("btnGuardar");
var botonActualizar = document.getElementById("btnActualizar");
var botonEliminar = document.getElementById("btnEliminar");

botonGuardar.disabled = false;
botonActualizar.disabled = true;
botonEliminar.disabled = true;

let formulario = document.getElementById("formulario");
let campos = formulario.querySelectorAll("input, select");
let idPersonaSeleccionada = null; // Guardará el ID real de la base de datos para actualizar o eliminar

// Efectos visuales de enfoque
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
// 1. OBTENER PERSONAS (GET) - Cargar la tabla
// ==========================================
function cargarPersonas() {
    fetch('http://localhost:3000/personas')
        .then(respuesta => respuesta.json())
        .then(data => {
            personas = data; 
            mostrarPersona(); 
        })
        .catch(error => console.error("Error al cargar las personas:", error));
}

// Cargar al iniciar la página
cargarPersonas();


// ==========================================
// 2. CREAR PERSONA (POST) - Botón Guardar
// ==========================================
botonGuardar.addEventListener("click", function(){
    let persona = {};
    campos.forEach(campo =>{
        persona[campo.id] = campo.value;
    });

    if (!persona.numeroDocumento || !persona.nombres) {
        alert("Por favor completa al menos el documento y los nombres.");
        return;
    }

    fetch('http://localhost:3000/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    })
    .then(respuesta => respuesta.json())
    .then(datosGuardados => {
        alert("¡Persona guardada exitosamente!");
        limpiarFormulario();
        cargarPersonas();
    })
    .catch(error => console.error("Error al guardar:", error));
});


// ==========================================
// BUSCAR POR DOCUMENTO (Para activar Actualizar/Eliminar)
// ==========================================
let numeroDocumentoInput = document.getElementById("numeroDocumento");
let tipoDocumentoInput = document.getElementById("tipoDocumento");

numeroDocumentoInput.addEventListener("blur", function(){
    let docBusqueda = numeroDocumentoInput.value;
    let tipoBusqueda = tipoDocumentoInput.value;

    if (!docBusqueda) return;

    // Buscamos en la lista actual que trajimos del servidor
    let personaEncontrada = personas.find(
        p => p.numeroDocumento === docBusqueda && p.tipoDocumento === tipoBusqueda
    );

    if(personaEncontrada){
        // Rellenamos los campos con los datos encontrados
        campos.forEach(campo => {
            if(personaEncontrada[campo.id] !== undefined) {
                // Si es un campo de fecha, recortamos para que el input lo acepte correctamente
                if (campo.type === "date" && personaEncontrada[campo.id]) {
                    campo.value = personaEncontrada[campo.id].substring(0, 10);
                } else {
                    campo.value = personaEncontrada[campo.id];
                }
            }
        });

        // Guardamos el ID interno de la base de datos (id_persona)
        idPersonaSeleccionada = personaEncontrada.id_persona;

        alert("¡Persona encontrada! Ya puedes actualizarla o eliminarla.");

        botonGuardar.disabled = true;
        botonActualizar.disabled = false;
        botonEliminar.disabled = false;
    }
});


// ==========================================
// 3. ACTUALIZAR PERSONA (PUT) - Botón Actualizar
// ==========================================
botonActualizar.addEventListener("click", function(){
    if (!idPersonaSeleccionada) {
        alert("No hay ningua persona seleccionada para actualizar.");
        return;
    }

    let personaActualizada = {};
    campos.forEach(campo =>{
        if (campo.type === "date" && campo.value) {
        // Cortamos para enviar solo la fecha (YYYY-MM-DD) sin la hora UTC
        personaActualizada[campo.id] = campo.value.substring(0, 10);
    } else {
        personaActualizada[campo.id] = campo.value;
    }
});
    

    //console.log("el id seleccionado es:", idPersonaSeleccionada);
    //console.log("tipo de datos:", typeof idPersonaSeleccionada);

    fetch(`http://localhost:3000/personas/${idPersonaSeleccionada}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personaActualizada)
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        alert("¡Persona actualizada exitosamente!");
        limpiarFormulario();
        cargarPersonas();
    })
    .catch(error => console.error("Error al actualizar:", error));
    });


// ==========================================
// 4. ELIMINAR PERSONA (DELETE) - Botón Eliminar
// ==========================================
botonEliminar.addEventListener("click", function(){
    if (!idPersonaSeleccionada) {
        alert("No hay ninguna persona seleccionada para eliminar.");
        return;
    }

    if (confirm("¿Estás seguro de que deseas eliminar a esta persona?")) {
        fetch(`http://localhost:3000/personas/${idPersonaSeleccionada}`, {
            method: 'DELETE'
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            alert("¡Persona eliminada exitosamente!");
            limpiarFormulario();
            cargarPersonas();
        })
        .catch(error => console.error("Error al eliminar:", error));
    }
});


// ==========================================
// FUNCIONES AUXILIARES
// ==========================================
function limpiarFormulario() {
    campos.forEach(campo => campo.value = "");
    idPersonaSeleccionada = null;
    botonGuardar.disabled = false;
    botonActualizar.disabled = true;
    botonEliminar.disabled = true;
}

let tabla = document.getElementById("tablaPersona");

function mostrarPersona(){
    tabla.innerHTML = ""; 

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