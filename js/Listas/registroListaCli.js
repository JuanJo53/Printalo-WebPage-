window.onload = ValidarNeg();
//Obtiene los datos de los pedidos respectivos de la base de datos.
async function getDocsData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var dueño, timestamp, fecha, materia, titulo;
	var nroHojas = 0,
		precio = 0.0;
	var negocioID;
	await bd
		.collection("Negocios")
		.where("nombreNeg", "==", nombre)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				negocioID = doc.id;
			});
		});
	console.log(negocioID);
	bd.collection("Listas")
		.where("negocioID", "==", negocioID)
		.orderBy("fecha")
		.onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			changes.forEach(change => {
				if (change.type == "added") {
					dueño = change.doc.data().dueño;
					materia = change.doc.data().materia;
					precio = change.doc.data().precio;
					titulo = change.doc.data().nombreDoc;
					nroHojas = change.doc.data().numHojas;
					timestamp = new Date(change.doc.data().fecha.toDate());
					fecha = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
					setData(titulo, dueño, materia);
				}
			});
		});
}

//ESta funcion es la que adiciona los datos necesarios para llenar la tabla de pedidos adicionados.
function setData(titulo, dueño, materia) {
	var table = document.getElementsByTagName("table")[0];
	var newRow = table.insertRow(1);

	var title = newRow.insertCell(0);
	var mat = newRow.insertCell(1);
	var dueñ = newRow.insertCell(2);
	var solic = newRow.insertCell(3);

	title.className = "text-center";
	mat.className = "text-center";
	dueñ.className = "text-center";
	solic.className = "text-center";

	title.innerHTML = titulo;
	mat.innerHTML = materia;
	dueñ.innerHTML = dueño;
	solic.innerHTML = `<button id="solicitar" onclick="getDocDet(this)" class="btn positive bg-printalo-greenDetail text-light"
    data-toggle="modal" data-target="#solicitardelista">Solicitar</button>`;
}

//Detalles del pedido seleccionado para rechazar o aceptar el pedido.
function getDocDet(_this) {
	var titulo, dueño, materia, nroHojas, precio, fecha;
	console.log(_this.id);

	titulo = getRowSelected(_this, 0);
	dueño = getRowSelected(_this, 1);
	materia = getRowSelected(_this, 2);
	nroHojas = getRowSelected(_this, 3);
	precio = getRowSelected(_this, 4);
	fecha = getRowSelected(_this, 5);

	var lista = new Lista(dueño, fecha, materia, titulo, nroHojas, precio);
}
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed, col) {
	var a = objectPressed.parentNode.parentNode;
	var nomb = a.getElementsByTagName("td")[col].innerHTML;
	return nomb;
}
var nombre;
function getNeg() {
	var ref = window.location.search;
	var neg = ref.split("=");
	nombre = neg[1];
	document.getElementById("titleLista").innerHTML = "Lista de Negocio de " + nombre;
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
