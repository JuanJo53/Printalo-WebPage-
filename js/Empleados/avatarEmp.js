//Set inicial en avatar de web
var user = firebase.auth().currentUser;
var bd = firebase.firestore();
var userid = user.uid;
var nombre, inicial, telef, mail;
console.log(userid);
var docRef = bd.collection("Empleados").doc(userid);
docRef
	.get()
	.then(function(doc) {
		if (doc.exists) {
			nombre = doc.data().nombreNeg;
			telef = doc.data().telefono;
			mail = doc.data().email;
			inicial = nombre.charAt(0);
			document.getElementById("inicialEmp").innerHTML = inicial;
			document.getElementById("avtNomb").innerHTML = nombre;
			document.getElementById("avtTelf").innerHTML = telef;
			document.getElementById("avtMail").innerHTML = mail;
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
function ValidarEmp() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			SetInicialNeg();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/empleadoUI/pedidosNeg/pedSolicitudes.html";
		}
	});
}
