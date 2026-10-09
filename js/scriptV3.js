var botonGuardar = document.getElementById("btnGuardar");
var botonActualizar = document.getElementById("btnActualizar");
var botonEliminar = document.getElementById("btnEliminar");

botonGuardar.disabled = false;
botonActualizar.disabled = true;
botonEliminar.disabled = true;

let formulario = document.getElementById("formulario");
let campos = formulario.querySelectorAll("input, select");

campos.forEach(campo =>{

    campo.addEventListener("focus", function(){
        this.style.backgroundColor = "gray";

    });

    campo.addEventListener("blur", function(){
        this.style.backgroundColor = "white";

    });

});

let personas = [];

// Guardar objeto e imprimir por consola
botonGuardar.addEventListener("click", function(){

        let persona = {};

        console.log("Creando objeto");

        campos.forEach(campo =>{

            persona[campo.id] = campo.value;
            campo.value = "";
        });

        validarPersona(persona);
});


let numeroDocumento = document.getElementById("numeroDocumento");

numeroDocumento.addEventListener("change", function(){

    let personaExistente = personas.find(
        p => p.numeroDocumento === numeroDocumento.value && p.tipoDocumento === tipoDocumento.value
    );

    if(personaExistente){

        campos.forEach(campo => {
            campo.value = personaExistente[campo.id];
        });

        alert("Documento: " + personaExistente.numeroDocumento + ", ya existe" + "\nNombre: " +
            personaExistente.nombres + " " + personaExistente.apellidos
        );

        botonGuardar.disabled = true;
        botonActualizar.disabled = false;
        botonEliminar.disabled = false;

    } else {
// Enviar los datos al backend
        fetch('http://localhost:3000/personas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(persona) // Convertimos el objeto a texto JSON
        })
        .then(respuesta => respuesta.json())
        .then(datosGuardados => {
            console.log("Respuesta del servidor:", datosGuardados);
            
            // Actualizar la tabla visual
            personas.push(persona);
            mostrarPersona();

            botonActualizar.disabled = true;
            botonEliminar.disabled = true;
            botonGuardar.disabled = false;
            
            alert("Persona guardada exitosamente en la base de datos");
        })
        .catch(error => {
            console.error("Error al conectar con el servidor:", error);
            alert("Hubo un error al conectar con el servidor.");
});

let tabla = document.getElementById("tablaPersona");

// Función para agregar las personas la tabla
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
 
};

// Función para validar si ya existe una persona con un número de documento
function validarPersona(persona){

    let personaExistente = personas.find(
        p => p.numeroDocumento === numeroDocumento.value && p.tipoDocumento === tipoDocumento.value
    );

    if(personaExistente){

        campos.forEach(campo=>{
            campo.value = personaExistente[campo.id];
        });

        alert("Documento: " + personaExistente.numeroDocumento + ", ya existe" + "\nNombre: " +
            personaExistente.nombres + " " + personaExistente.apellidos
        );

        botonGuardar.disabled = true;
        botonActualizar.disabled = false;
        botonEliminar.disabled = false;
        
        return;
    } else{
        personas.push(persona);
        console.log(persona);
        mostrarPersona();

        botonActualizar.disabled = true;
        botonEliminar.disabled = true;
        botonGuardar.disabled = false;
    }
};
