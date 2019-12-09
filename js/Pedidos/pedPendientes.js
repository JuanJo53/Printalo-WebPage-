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
		.where("estado", "==", "pendiente")
		.orderBy("fecha")
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				var clienteID = doc.data().clienteID;
				var docRef = bd.collection("Clientes").doc(clienteID);
				docRef
					.get()
					.then(function(docu) {
						if (docu.exists) {
							arch = doc.data().nombreDoc;
							nomb = docu.data().Nombre;
							precio = doc.data().costoTotal;
							cant = doc.data().cantidad;
							pago = doc.data().metodoPago;
							timestamp = new Date(doc.data().fechaEntrega.toDate());
							fecha =
								timestamp.getDate() +
								"/" +
								(timestamp.getMonth() + 1) +
								"/" +
								timestamp.getFullYear();
							hora = timestamp.getHours() + ":" + timestamp.getMinutes();
							setData(arch, nomb, precio, cant, pago, fecha, hora);
						} else {
							console.log("No such document!");
						}
					})
					.catch(function(error) {
						console.log("Error getting document:", error);
					});
			});
		})
		.catch(function(error) {
			console.log("Error obteniendo los documentos: ", error);
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
                `<div class="color-printalo-greenDetail"><i class="far fa-square fa-2x"></i>
                </div>`,
				`<button id="detalles" onclick="getPedDet(this)" href="" class="btn bg-printalo-greenDetail positive" 
					data-dismiss="modal" data-target="#modalVerDetalles" 
					data-toggle="modal">Detalles
				</button>`
			])
			.draw(false);
	});
}
//Detalles del pedido seleccionado para rechazar o aceptar el pedido.
function getPedDet(_this) {
	var doc,
		color,
		tam,
		imp,
		paginas,
		acabado,
		tipo,
		cant,
		usuario,
		fecha,
		hora,
		fechaE,
		horaE,
		pago,
		precio;
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