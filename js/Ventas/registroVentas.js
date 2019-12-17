window.onload = ValidarNeg();
//Obtiene los datos de los pedidos respectivos de la base de datos.
function getDocsData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var pago,
		precio,
		cant = 0,
		fecha = "",
		hora = "",
		timestamp,
		nit,
		numfactura;
	bd.collection("Venta")
		.where("negocioID", "==", user.uid)
		.orderBy("fecha")
		.onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			changes.forEach(change => {
				if (change.type == "added") {
					pago = change.doc.data().metodoPago;
					cant = change.doc.data().cantidad;
					precio = change.doc.data().monto;
					nit = change.doc.data().nitCliente;
					numfactura = change.doc.data().numFactura;
					timestamp = new Date(change.doc.data().fecha.toDate());
					fecha =
						timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
					hora = timestamp.getHours() + ":" + timestamp.getMinutes() + ":" + timestamp.getSeconds();
					setData(pago, precio, cant, fecha, hora, nit, numfactura);
				}
			});
		});
}
//Setea los datos de los pedidos en la tabla respectiva.
function setData(pago, precio, cant, fecha, hora, nit, numfactura) {
	var table = document.getElementsByTagName("table")[0];
	var newRow = table.insertRow(1);

	var num = newRow.insertCell(0);
	var pag = newRow.insertCell(1);
	var nitCliente = newRow.insertCell(2);
	var costo = newRow.insertCell(3);
	var cantidad = newRow.insertCell(4);
	var f = newRow.insertCell(5);
	var h = newRow.insertCell(6);
	var detalles = newRow.insertCell(7);

	num.className = "text-center";
	pag.className = "text-center";
	nitCliente.className = "text-center";
	costo.className = "text-center";
	cantidad.className = "text-center";
	f.className = "text-center";
	h.className = "text-center";
	detalles.className = "text-center";

	$(document).ready(function() {
		var t = $("#example").DataTable();
		t.row
			.add([
				numfactura,
				nit,
				precio,
				cant,
				pago,
				fecha,
				hora,
				`<button id="detalles" onclick="getPedDet(this)" href="" 
					class="btn bg-printalo-greenDetail positive" 
					data-dismiss="modal" data-target="#modalVerDetalles" 
					data-toggle="modal">Detalles
				</button>`
			])
			.draw(false);
	});
}
//Detalles del pedido seleccionado para rechazar o aceptar el pedido.
function getPedDet(_this) {
	var numFactura, apellido, cant, fecha, hora, pago, precio;
	console.log(_this.id);

	numFactura = getRowSelected(_this, 0);
	nit = getRowSelected(_this, 1);
	precio = getRowSelected(_this, 2);
	cant = getRowSelected(_this, 3);
	pago = getRowSelected(_this, 4);
	fecha = getRowSelected(_this, 5);
	hora = getRowSelected(_this, 6);

	var venta = new Venta();
	venta.setPedDet(nit, numFactura, fecha, hora);
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
