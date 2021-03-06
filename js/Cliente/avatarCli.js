//Set inicial en avatar de web
var user = firebase.auth().currentUser;
var bd = firebase.firestore();
var userid = user.uid;
var nombre;
console.log(userid);
var docRef = bd.collection("Clientes").doc(userid);
docRef
	.get()
	.then(function(doc) {
		if (doc.exists) {
			console.log("Datos de Clientes:", doc.data());
			nombre = doc.data().Nombre;
			apellido = doc.data().Apellido;
			telef = doc.data().telefono;
			mail = doc.data().email;
			var inicial = nombre.charAt(0);
			document.getElementById("mdlCliente").innerHTML = inicial;
			document.getElementById("avtCliente").innerHTML = nombre + " " + apellido;
			document.getElementById("avtTelef").innerHTML = telef;
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
	var usuario = new Usuario();
	usuario.logout();
	ValidarCli();
}

// Esta funcion ejecuta el observador de firebase
function ValidarCli() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			alert("Logeado");
			location.href = "/html/usuarioUI/documentosCli/porEnviar.html";
		} else {
			// User is not signed in.
			alert("No Logeado");
			location.href = "/html/index/usuarioIndex/indexUser.html";
		}
	});
}
