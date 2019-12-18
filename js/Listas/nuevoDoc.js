window.onload = ValidarNeg();
var fecha, hora;
var timestamp;
function getListaDat() {
	var color, tamaño, impresion, acabado, tipoHoja;
	var dueño = document.getElementById("dueño").value;
	var materia = document.getElementById("materia").value;
	var titulo = document.getElementById("tituloDoc").value;
	var nroHojas = parseFloat(document.getElementById("numHojas").value);
	var precio = parseFloat(document.getElementById("precio").value);
	if (document.getElementById("color").checked) {
		color = "color";
	} else {
		color = "Blanco/Negro";
	}
	if (document.getElementById("carta").checked) {
		tamaño = "carta";
	} else if (document.getElementById("a4").checked) {
		tamaño = "a4";
	} else {
		tamaño = "oficio";
	}
	if (document.getElementById("intercalado").checked) {
		impresion = "intercalado";
	} else {
		impresion = "anv/rev";
	}
	if (document.getElementById("normal").checked) {
		acabado = "normal";
	} else {
		acabado = "engrampado";
	}
	if (document.getElementById("hojaNormal").checked) {
		tipoHoja = "normal";
	} else {
		tipoHoja = "reutilizado";
	}
	var lista = new Lista(dueño, timestamp, materia, titulo, nroHojas, precio, acabado, tipoHoja, impresion, tamaño, color);
	lista.nuevoDoc();
}
// Esta funcion ejecuta el observador de firebase
function ValidarNeg() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			timestamp = firebase.firestore.Timestamp.now().toDate();
			hora = timestamp.getHours() + ":" + timestamp.getMinutes();
			fecha = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
			document.getElementById("fecha").value = fecha;
			document.getElementById("hora").value = hora;
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/usuarioIndex/indexUser.html";
		}
	});
}
