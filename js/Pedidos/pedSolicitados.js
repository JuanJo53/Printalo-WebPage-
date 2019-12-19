window.onload = ValidarNeg();
//Obtiene los datos de los pedidos respectivos de la base de datos.
function getDocsData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var nomb,
		precio,
		cant = 0,
		pago = "",
		fecha = "",
		hora = "",
		timestamp;
	bd.collection("Pedido")
		.where("negocioID", "==", user.uid)
		.where("estado", "==", "solicitado")
		.orderBy("fecha")
		.onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			changes.forEach(async function(change) {
				console.log(change.doc.id);
				if (change.type == "added") {
					var clienteID = change.doc.data().clienteID;
					await bd
						.collection("Clientes")
						.doc(clienteID)
						.get()
						.then(function(docu) {
							nomb = docu.data().Nombre;
						});
					arch = change.doc.data().nombreDoc;
					precio = change.doc.data().costoTotal;
					cant = change.doc.data().cantidad;
					pago = change.doc.data().metodoPago;
					timestamp = new Date(change.doc.data().fechaEntrega.toDate());
					fecha = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
					hora = timestamp.getHours() + ":" + timestamp.getMinutes();
					setData(arch, nomb, precio, cant, pago, fecha, hora);
				}
			});
		});
}
//Setea los datos de los pedidos en la tabla respectiva.
function setData(doc, nomb, prec, cant, pag, f, h) {
	var table = document.getElementsByTagName("table")[0];
	var newRow = table.insertRow(1);

	var nro = newRow.insertCell(0);
	var nombUser = newRow.insertCell(1);
	var precio = newRow.insertCell(2);
	var cantidad = newRow.insertCell(3);
	var pago = newRow.insertCell(4);
	var fecha = newRow.insertCell(5);
	var hora = newRow.insertCell(6);
	var detalles = newRow.insertCell(7);
	var rechazar = newRow.insertCell(8);

	nro.className = "text-center";
	nombUser.className = "text-center";
	precio.className = "text-center";
	cantidad.className = "text-center";
	pago.className = "text-center";
	fecha.className = "text-center";
	hora.className = "text-center";
	detalles.className = "text-center";
	rechazar.className = "text-center";

	$(document).ready(function() {
		var t = $("#example").DataTable();
		t.row
			.add([
				doc,
				nomb,
				prec,
				cant,
				pag,
				f,
				h,
				`<button id="detalles" onclick="getPedDet(this)" href="" class="btn bg-printalo-greenDetail positive" 
					data-dismiss="modal" data-target="#modalVerDetalles" 
					data-toggle="modal">Detalles
				</button>`,
				`<button onclick="getPedDet(this)" id="rechazar" href="" class="btn bg-printalo-blueDetail negative" 
					data-dismiss="modal" data-target="#eliminarPedido" 
					data-toggle="modal">Rechazar
				</button>`
			])
			.draw(false);
	});
}
//Detalles del pedido seleccionado para rechazar o aceptar el pedido.
function getPedDet(_this) {
	var doc, color, tam, imp, paginas, acabado, tipo, cant, usuario, fecha, hora, fechaE, horaE, pago, precio;
	doc = getRowSelected(_this, 0);
	usuario = getRowSelected(_this, 1);
	precio = getRowSelected(_this, 2);
	cant = getRowSelected(_this, 3);
	pago = getRowSelected(_this, 4);
	fechaE = getRowSelected(_this, 5);
	horaE = getRowSelected(_this, 6);

	var pedido = new Pedido();
	console.log(_this.id);
	if (_this.id === "detalles") {
		pedido.setPedDet(doc, usuario, precio, cant, pago, fechaE, horaE);
	} else if (_this.id === "rechazar") {
		var btnEliminar = document.getElementById("eliminar");
		btnEliminar.addEventListener("click", function() {
			pedido.rechazarPedido(doc, precio, cant, pago, fechaE, horaE);
		});
	}
}
//Detalles del pedido seleccionado para rechazar o aceptar el pedido.
function rechPed() {
	var doc, cant, fechaE, horaE, pago, precio;

	doc = document.getElementById("nombreDocD").innerHTML;
	precio = document.getElementById("costoD").value;
	cant = document.getElementById("cantD").value;
	pago = document.getElementById("pagoD").value;
	fechaE = document.getElementById("fEntregaD").value;
	horaE = document.getElementById("hEntregaD").value;
	var pedido = new Pedido();
	pedido.rechazarPedido(doc, precio, cant, pago, fechaE, horaE);
}
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed, col) {
	var a = objectPressed.parentNode.parentNode;
	var nomb = a.getElementsByTagName("td")[col].innerHTML;
	return nomb;
}
// Esta funcion ejecuta el observador de firebase
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
