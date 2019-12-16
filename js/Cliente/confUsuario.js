//Apenas cargue la pagina
window.onload = ValidarCli();
//Esta funcion habilita los inputs de configuracion de negocio
function habilitarCamposPerfilUsuario() {
	//console.log("here");
	var auxNombre = document.getElementById("nombreUsuario").disabled;
	var auxApellido = document.getElementById("apellidoUsuario").disabled;
	var auxTelefono = document.getElementById("telefonoUsuario").disabled;
	var auxEmail = document.getElementById("emailUsuario").disabled;
	if (auxNombre === false && auxApellido === false && auxTelefono === false && auxEmail === false) {
		bloquearCamposPefilUsuario();
	} else {
		document.getElementById("nombreUsuario").disabled = false;
		document.getElementById("apellidoUsuario").disabled = false;
		document.getElementById("telefonoUsuario").disabled = false;
		document.getElementById("emailUsuario").disabled = false;
	}
	habilitarBtnGuardarCambios();
}
//Esta funcion habilita los inputs de configuracion para datos de tarjeta
function habilitarCamposTarjeta() {
	//console.log("here");
	var auxnombre = document.getElementById("Tnombre").disabled;
	var auxnumero = document.getElementById("Tnumero").disabled;
	var auxmes = document.getElementById("Tmes").disabled;
	var auxaño = document.getElementById("Tanio").disabled;
	var auxcvv = document.getElementById("Tcvv").disabled;

	if (
		auxnombre === false &&
		auxnumero === false &&
		auxmes === false &&
		auxaño === false &&
		auxcvv === false
	) {
		bloquearCamposTarjeta();
	} else {
		document.getElementById("Tnombre").disabled = false;
		document.getElementById("Tnumero").disabled = false;
		document.getElementById("Tmes").disabled = false;
		document.getElementById("Tanio").disabled = false;
		document.getElementById("Tcvv").disabled = false;
	}
	habilitarBtnGuardarCambios();
}
//habilita los campos para cambios de perfil de usuario
function habilitarBtnGuardarCambios() {
	document.getElementById("btnGuardarCambios").disabled = false;
}
//bloquea los campos para cambios de perfil de usuario
function bloquearCamposPefilUsuario() {
	document.getElementById("nombreUsuario").disabled = true;
	document.getElementById("apellidoUsuario").disabled = true;
	document.getElementById("telefonoUsuario").disabled = true;
	document.getElementById("emailUsuario").disabled = true;
}
function bloquearCamposTarjeta() {
	document.getElementById("Tnombre").disabled = true;
	document.getElementById("Tnumero").disabled = true;
	document.getElementById("Tmes").disabled = true;
	document.getElementById("Tanio").disabled = true;
	document.getElementById("Tcvv").disabled = true;
}
//guarda los cambios de perfil de usuario
function GuardarCambiosPerfilUsuario() {
	var btnGuardarCambios = document.getElementById("btnGuardarCambios").disabled;
	if (btnGuardarCambios === false) {
		console.log("click");
		new Cliente().GuardarCambiosPerfilUsuario();
		//new Negocio().GuardarCambiosAdministrador();
		//document.getElementById("btnGuardarCambios").disabled=true;
		bloquearCamposPefilUsuario();
	}
}
//
function ValidarCli() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			var cli = new Cliente();
			cli.setDatosPerfilUsuarioAct();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/usuarioIndex/indexUser.html";
		}
	});
}
