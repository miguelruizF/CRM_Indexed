(function(){
    let DB;
    const formulario = document.querySelector("#formulario");

    document.addEventListener("DOMContentLoaded", ()=>{
        conectarDB();

        formulario.addEventListener("submit", validarCliente);
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

    function validarCliente(e){
        e.preventDefault();
        //Leer los inputs
        const nombre = document.querySelector("#nombre").value;
        const email = document.querySelector("#email").value;
        const telefono =  document.querySelector("#telefono").value;
        const empresa = document.querySelector("#empresa").value;
        // console.log("Validando");

        if(nombre === "" || email === "" || telefono === "" || empresa === ""){
            // console.error("Error");
            imprimirAlerta("Todos los campos son obligatorios", "error");
            return;
        }

        //Objeto con la informacion del cliente
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }
        cliente.id = Date.now();
        console.log(cliente);

        //Funcion para crear nuevo cliente
        crearNuevoCliente(cliente);
    }

    //Funcion para crear cliente
    function crearNuevoCliente(cliente) {
        //Crear transaccion para escribir en la base de datos
        const transaction = DB.transaction(["crm"], "readwrite");
        const objectStore = transaction.objectStore("crm");
        //ObjectStore realizara todas las operaciones
        objectStore.add(cliente);
        //Si existe un error al agregar un cliente
        transaction.onerror = function() {
            imprimirAlerta("Hubo un error", "error");
            // imprimirAlerta("Hubo un error", "error");
        }
        //Si el cliente se agrega correctamente
        transaction.oncomplete = function() {
            // console.log("Cliente agregado correctamente")
            imprimirAlerta("El cliente se agrego correctamente");

            //Cambiar de ventana
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
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