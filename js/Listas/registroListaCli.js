window.onload = ValidarNeg();
//Obtiene los datos de los pedidos respectivos de la base de datos.
function getDocsData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var dueño, timestamp, fecha, materia, titulo;
	var nroHojas = 0,
		precio = 0.0;
	bd.collection("Listas")
		.where("negocioID", "==", user.uid)
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
					setData(titulo, dueño, materia, nroHojas, precio, fecha);
				}
			});
		});
}
//Setea los datos de los pedidos en la tabla respectiva.
function setData(titulo, dueño, materia, nroHojas, precio, fecha) {
	var table = document.getElementsByTagName("table")[0];
	var newRow = table.insertRow(1);

	var title = newRow.insertCell(0);
	var dueñ = newRow.insertCell(1);
	var mat = newRow.insertCell(2);
	var hojas = newRow.insertCell(3);
	var prec = newRow.insertCell(4);
	var f = newRow.insertCell(5);
	var editar = newRow.insertCell(6);
	var eliminar = newRow.insertCell(7);

	title.className = "text-center";
	dueñ.className = "text-center";
	mat.className = "text-center";
	hojas.className = "text-center";
	prec.className = "text-center";
	f.className = "text-center";
	editar.className = "text-center";
	eliminar.className = "text-center";

	$(document).ready(function() {
		var t = $("#example").DataTable();
		t.row
			.add([
				titulo,
				dueño,
				materia,
				nroHojas,
				precio,
				fecha,
				`<button id="editar" onclick="getDocDet(this)"
                href=""
                class="btn bg-printalo-greenDetail positive"
                data-dismiss="modal"
                data-target="#modalVerDetalles"
                data-toggle="modal"
                >Editar</button>`,
				`<button id="eliminar" onclick="getDocDet(this)" href="" class="btn bg-printalo-blueDetail negative">Eliminar</button>`
			])
			.draw(false);
	});
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
	if (_this.id === "eliminar") {
		lista.eliminarDoc(dueño, titulo);
	} else if (_this.id === "editar") {
		lista.editarDoc(dueño, titulo);
	}
}
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed, col) {
	var a = objectPressed.parentNode.parentNode;
	var nomb = a.getElementsByTagName("td")[col].innerHTML;
	return nomb;
}

// Esta funcion ejecuta el observador de firebase
function ValidarNeg() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			getDocsData();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/usuarioIndex/indexUser.html";
		}
	});
}
