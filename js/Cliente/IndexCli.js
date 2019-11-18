// Evento de Boton Registrar
function RegCli(){
    var nombre = document.getElementById("txtName").value;
    var apellido = document.getElementById("txtLastName").value;
    var num = document.getElementById("txtNum").value;
    var email = document.getElementById("txtEmail").value;
    var pass = document.getElementById("txtPass").value;
    const cliente = new Cliente(email,pass,nombre,apellido,num);
    cliente.RegistrarCli(apellido,email,nombre,num);
    //ValidarCli();
}
// Evento de Boton Ingresar
function IngCli(){
    var email = document.getElementById("txtEmailUser").value;
    var pass = document.getElementById("txtPassUser").value;
    const cliente = new Cliente(email,pass);
    cliente.IngresarCli();
    ValidarCli();    
}

// Esta funcion ejecuta el observador de firebase
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            alert("Logeado");
            location.href="/html/usuarioUI/documentosCli/porEnviar.html";       
        } else {
            // User is not signed in.
            alert("No Logeado");
        }
    });
}
