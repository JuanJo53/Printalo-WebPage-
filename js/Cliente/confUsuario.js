//Esta funcion habilita los inputs de configuracion de negocio
function habilitarCamposPerfilUsuario() {
	//console.log("here");
	var auxNombre=document.getElementById("nombreUsuario").disabled;
	var auxApellido=document.getElementById("apellidoUsuario").disabled;
	var auxTelefono=document.getElementById("telefonoUsuario").disabled;
	var auxEmail=document.getElementById("emailUsuario").disabled;
	if  (auxNombre=== false && auxDireccion===false) {
		document.getElementById("nombreUsuario").disabled = true;
		document.getElementById("apellidoUsuario").disabled = true;
		document.getElementById("telefonoUsuario").disabled = true;
		document.getElementById("emailUsuario").disabled = true;
	} else {
		document.getElementById("nombreUsuario").disabled = false;
		document.getElementById("apellidoUsuario").disabled = false;
		document.getElementById("telefonoUsuario").disabled = false;
		document.getElementById("emailUsuario").disabled = false;
	}
	habilitarBtnGuardarCambios();
}
function habilitarBtnGuardarCambios() {
	document.getElementById("btnGuardarCambios").disabled=false;
}
function bloquearCamposPefilUsuario(){
	document.getElementById("nombreUsuario").disabled = true;
	document.getElementById("apellidoUsuario").disabled = true;
	document.getElementById("telefonoUsuario").disabled = true;
	document.getElementById("emailUsuario").disabled = true;
}
function GuardarCambiosPerfilUsuario() {
	var btnGuardarCambios=document.getElementById("btnGuardarCambios").disabled;
	if(btnGuardarCambios===false){
		console.log("click");
		//new Negocio().GuardarCambiosNegocioGenerales();
		//new Negocio().GuardarCambiosAdministrador();
		//document.getElementById("btnGuardarCambios").disabled=true;
        bloquearCamposPefilUsuario();
	}
}