//Apenas cargue la pagina
window.onload = ValidarNeg();

//Esta funcion habilita el input para editar Impresiones a Blanco y Negro
function habilitarCamposDatosNegocio() {
	//console.log("here");
	var auxNombre=document.getElementById("nombreNegocio").disabled;
	var auxDireccion=document.getElementById("direccionNegocio").disabled;
	var auxTelefono=document.getElementById("telefonoNegocio").disabled;
	var auxEmail=document.getElementById("emailNegocio").disabled;
	if  (auxNombre=== false && auxDireccion===false) {
		bloquearDatosGenerales();
	} else {
		document.getElementById("nombreNegocio").disabled = false;
		document.getElementById("direccionNegocio").disabled = false;
		document.getElementById("telefonoNegocio").disabled = false;
		document.getElementById("emailNegocio").disabled = false;
	}
	habilitarBtnGuardarCambios();
}

function habilitarCamposAdministrador() {
	//console.log("here");
	var auxNombre=document.getElementById("nombreAdm").disabled;
	var auxApellido=document.getElementById("apellidoAdm").disabled;
	if  (auxNombre=== false && auxApellido===false) {
		bloquearDatosAdministrador();
	} else {
		document.getElementById("nombreAdm").disabled = false;
		document.getElementById("apellidoAdm").disabled = false;
	}
	habilitarBtnGuardarCambios();
}
function habilitarCamposHorario() {
	//console.log("here");
	var auxNombre=document.getElementById("lunesEntrada").disabled;
	var auxApellido=document.getElementById("lunesSalida").disabled;
	if  (auxNombre=== false && auxApellido===false) {
		bloquearDatosHorario();
	} else {
		document.getElementById("lunesEntrada").disabled = false;
		document.getElementById("lunesSalida").disabled = false;
	}
	habilitarBtnGuardarCambios();
}
// Esta funcion ejecuta el observador de firebase
function ValidarNeg() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			var neg=new Negocio("","","","","","","","precioBN");
			neg.setDatosGeneralesAct();
			neg.setDatosGeneralesAdministradorAct();
			neg.setHorarioNegocio();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/negocioIndex/indexNeg.html";
		}
	});
}
//btn de guarda los cambios
function GuardarCambiosNegocioGeneral() {
	var btnGuardarCambios=document.getElementById("btnGuardarCambios").disabled;
	if(btnGuardarCambios===false){
		//console.log("click");
		new Negocio().GuardarCambiosNegocioGenerales();
		new Negocio().GuardarCambiosAdministrador();
		document.getElementById("btnGuardarCambios").disabled=true;
		bloquearDatosGenerales();
		bloquearDatosAdministrador();
		bloquearDatosHorario();
	}
}
function habilitarBtnGuardarCambios() {
	document.getElementById("btnGuardarCambios").disabled=false;
	
}
//bloquea los input de campos generales
function bloquearDatosGenerales(){
	document.getElementById("nombreNegocio").disabled = true;
	document.getElementById("direccionNegocio").disabled = true;
	document.getElementById("telefonoNegocio").disabled = true;
	document.getElementById("emailNegocio").disabled = true;
}
//bloquea los input de administrador
function bloquearDatosAdministrador(){
	document.getElementById("nombreAdm").disabled = true;
	document.getElementById("apellidoAdm").disabled = true;
}
//bloquea los input de horario
function bloquearDatosHorario(){
	document.getElementById("lunesEntrada").disabled = true;
	document.getElementById("lunesSalida").disabled = true;
}
