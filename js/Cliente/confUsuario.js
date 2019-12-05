//Apenas cargue la pagina
window.onload = ValidarCli();
//Esta funcion habilita los inputs de configuracion de negocio
function habilitarCamposPerfilUsuario() {
	//console.log("here");
	var auxNombre=document.getElementById("nombreUsuario").disabled;
	var auxApellido=document.getElementById("apellidoUsuario").disabled;
	var auxTelefono=document.getElementById("telefonoUsuario").disabled;
	var auxEmail=document.getElementById("emailUsuario").disabled;
	if  (auxNombre=== false && auxApellido===false && auxTelefono===false && auxEmail===false ) {
		bloquearCamposPefilUsuario();
	} else {
		document.getElementById("nombreUsuario").disabled = false;
		document.getElementById("apellidoUsuario").disabled = false;
		document.getElementById("telefonoUsuario").disabled = false;
		document.getElementById("emailUsuario").disabled = false;
	}
	habilitarBtnGuardarCambios();
}
//habilita los campos para cambios de perfil de usuario
function habilitarBtnGuardarCambios() {
	document.getElementById("btnGuardarCambios").disabled=false;
}
//bloquea los campos para cambios de perfil de usuario
function bloquearCamposPefilUsuario(){
	document.getElementById("nombreUsuario").disabled = true;
	document.getElementById("apellidoUsuario").disabled = true;
	document.getElementById("telefonoUsuario").disabled = true;
	document.getElementById("emailUsuario").disabled = true;
}
//guarda los cambios de perfil de usuario
function GuardarCambiosPerfilUsuario() {
	var btnGuardarCambios=document.getElementById("btnGuardarCambios").disabled;
	if(btnGuardarCambios===false){
		console.log("click");
		new Cliente().GuardarCambiosPerfilUsuario();
		//new Negocio().GuardarCambiosAdministrador();
		//document.getElementById("btnGuardarCambios").disabled=true;
        bloquearCamposPefilUsuario();
	}
}
//
function ValidarCli(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var cli=new Cliente();
            cli.setDatosPerfilUsuarioAct();
            console.log("Logeado");
        }else{
            // User is not signed in.
            console.log("No Logeado");
            location.href="/html/index/usuarioIndex/indexUser.html"
        }
    });
}