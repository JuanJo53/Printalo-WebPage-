//Apenas cargue la pagina
window.onload = ValidarNeg();

//Esta funcion habilita el input para editar Impresiones a Blanco y Negro
function enableBN() {
	if (document.getElementById("txtPrecioBN").disabled === false) {
		document.getElementById("txtPrecioBN").disabled = true;
	} else {
		document.getElementById("txtPrecioBN").disabled = false;
	}
}
//Esta funcion habilita el input para editar Impresiones a Color
function enableColor() {
	if (document.getElementById("txtPrecioColor").disabled === false) {
		document.getElementById("txtPrecioColor").disabled = true;
	} else {
		document.getElementById("txtPrecioColor").disabled = false;
	}
}
//Esta funcion habilita los inputs para editar Tamaños de Hoja
function enableTamHoja() {
	if (document.getElementById("txtPrecioOficio").disabled === false) {
		document.getElementById("txtPrecioOficio").disabled = true;
		document.getElementById("txtPrecioCarta").disabled = true;
		document.getElementById("txtPrecioA4").disabled = true;
	} else {
		document.getElementById("txtPrecioOficio").disabled = false;
		document.getElementById("txtPrecioCarta").disabled = false;
		document.getElementById("txtPrecioA4").disabled = false;
	}
}
//Esta funcion habilita los inputs para editar Tipos de Hoja
function enableTipHoja() {
	if (document.getElementById("txtHojaNorm").disabled === false) {
		document.getElementById("txtHojaNorm").disabled = true;
		document.getElementById("txtHojaReu").disabled = true;
	} else {
		document.getElementById("txtHojaNorm").disabled = false;
		document.getElementById("txtHojaReu").disabled = false;
	}
}

// Esta funcion ejecuta el observador de firebase
function ValidarNeg() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			var neg = new Negocio("", "", "", "", "", "", "", "", "", "", "", "", "", "");
			neg.setPreciosAct();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/negocioIndex/indexNeg.html";
		}
	});
}
