(function() {
    let DB;

    const nombreInput = document.querySelector("#nombre");
    const emailInput = document.querySelector("#email");
    const telefonoInput = document.querySelector("#telefono");
    const empresaInput = document.querySelector("#empresa");
    const formulario = document.querySelector("#formulario");


    document.addEventListener("DOMContentLoaded", ()=>{
        //Conectar base de datos
        conectarDB();

        //Actualizar el registro
        formulario.addEventListener("submit", actualizarCliente);

        //Verificar el id de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        const idCliente = parametrosURL.get("id");
        // console.log(idCliente);
        if(idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function conectarDB() {
        const abrirConexion = window.indexedDB.open("crm", 1);

        abrirConexion.onerror = function(){
            console.log("Hubo un error");
        }

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(["crm"], "readwrite");
        const objectStore = transaction.objectStore("crm");

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;
            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente){
        const {nombre, email, telefono, empresa} = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function actualizarCliente(e) {
        e.preventDefault();
        if(nombreInput.value === "" || emailInput.value === "" || telefonoInput.value === "" || empresaInput.value === ""){
            imprimirAlerta("Todos los campos son obligatorios", "error");
            return;
        }
    }

    function imprimirAlerta(mensaje, tipo) {
        const alerta = document.querySelector(".alerta");
        if(!alerta){
            //crear alerta
            const divMensaje = document.createElement("div");
            divMensaje.classList.add("px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "mb-8", "text-center", "border", "alerta");
            if(tipo === "error"){
                divMensaje.classList.add("bg-red-100", "border-red-400", "text-red-700");
            }else{
                divMensaje.classList.add("bg-green-100", "border-green-400", "text-green-700");
            }
            divMensaje.textContent = mensaje;
            formulario.appendChild(divMensaje);
    
            //Borrar alerta
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }

})();