//Set inicial en avatar de web
var user = firebase.auth().currentUser;
var bd = firebase.firestore();
var userid = user.uid;
var nombre, inicial, telef, mail;
console.log(userid);
var docRef = bd.collection("Negocios").doc(userid);
docRef
	.get()
	.then(function(doc) {
		if (doc.exists) {
			console.log("Datos de Admin:", doc.data().adminID);
			nombre = doc.data().nombreNeg;
			telef = doc.data().fono;
			mail = doc.data().email;
			inicial = nombre.charAt(0);
			document.getElementById("mdlNegocio").innerHTML = inicial;
			document.getElementById("avtNombNeg").innerHTML = nombre;
			document.getElementById("avtTelfNeg").innerHTML = telef;
			document.getElementById("avtMailNeg").innerHTML = mail;
		} else {
			console.log("No such document!");
		}
	})
	.catch(function(error) {
		console.log("Error al obtener los datos:", error);
	});

// Evento de Boton Cerrar Secion
function Salir() {
	// Esta funcion pasa el email y su password a la clase Auth para logout con firebase
	var neg = new Negocio();
	neg.CerrarSecion();
	ValidarNeg();
}

// Esta funcion ejecuta el observador de firebase
function ValidarNeg() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			alert("Logeado");
			location.href = "/html/usuarioUI/documentosCli/porEnviar.html";
		} else {
			// User is not signed in.
			alert("No Logeado");
			location.href = "/html/index/negocioIndex/indexNeg.html";
		}
	});
}
