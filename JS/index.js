(function(){
    let DB;

    document.addEventListener("DOMContentLoaded", () => {
        crearDB();
    });

    //Crear Base de datos
    function crearDB() {
        //Se abre conexion
        const crearDB = window.indexedDB.open("crm", 1);

        //Si hay un error
        crearDB.onerror = function(){
            console.error("Hubo un error");
        }

        //Si no hay errores
        crearDB.onsuccess = function() {
            DB = crearDB.result;
        }

        //Se crea la tabla
        crearDB.onupgradeneeded = function(e){
            const db = e.target.result;
            const objectStore = db.createObjectStore("crm", {keyPath: "id", autoIncrement: true});
            objectStore.createIndex("nombre", "nombre", {unique:false});
            objectStore.createIndex("email", "email", {unique:true});
            objectStore.createIndex("telefono", "telefono", {unique:false});
            objectStore.createIndex("empresa", "empresa", {unique:false});
            objectStore.createIndex("id", "id", {unique:true});

            console.log("Base de datos creada");
        }
    }
})();