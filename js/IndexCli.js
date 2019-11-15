// Evento de Boton Registrar
var Registrar = document.getElementById("btnRegistrarUser");
Registrar.addEventListener("click", RegCli);
// Evento de Boton Ingresar
var Ingresar = document.getElementById("btbIngresarUser");
Ingresar.addEventListener("click", IngCli);

function RegCli(){
    var nombre = document.getElementById("txtName").value;
    var apellido = document.getElementById("txtLastName").value;
    var num = document.getElementById("txtNum").value;
    var email = document.getElementById("txtEmail").value;
    var pass = document.getElementById("txtPass").value;
    const cliente = new Cliente();
    cliente.RegistrarCli(email,pass);
}

function IngCli(){
    var email = document.getElementById("txtEmailUser").value;
    var pass = document.getElementById("txtPassUser").value;
    const cliente = new Cliente();
    cliente.IngresarCli(email,pass);
}
