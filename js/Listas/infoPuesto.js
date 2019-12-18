window.onload = ValidarNeg();

var btnLista = document.getElementById("listas");
btnLista.addEventListener("click", function() {
	var title = document.getElementById("titleInfo").innerHTML;
	var sp = title.split(" ");
	var negocioID = sp[2];
	console.log(negocioID);
	window.location = "./listasPuesto.html?negocio=" + negocioID;
});

async function getDocsData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var dir, telef, email;
	var negocioID;
	await bd
		.collection("Negocios")
		.where("nombreNeg", "==", nombre)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				negocioID = doc.id;
				dir = doc.data().dir;
				telef = doc.data().fono;
				email = doc.data().email;
			});
		});
	console.log(negocioID);
	setData(dir, telef, email);
}

function setData(dir, telef, email) {
	document.getElementById("direccion").innerHTML = `<span class="font-weight-bold">Calle : </span>` + dir;
	document.getElementById("telefono").innerHTML = `<span class="font-weight-bold">Telefono : </span>` + telef;
	document.getElementById("correo").innerHTML = `<span class="font-weight-bold">E-mail : </span>` + email;
}
var nombre;
function getNeg() {
	var ref = window.location.search;
	var neg = ref.split("=");
	nombre = neg[1];
	document.getElementById("titleInfo").innerHTML = "Informacion de " + nombre;
}
// Esta funcion ejecuta el observador de firebase
function ValidarNeg() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			getNeg();
			getDocsData();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/usuarioIndex/indexUser.html";
		}
	});
}
