window.onload = ValidarNeg();
//Obtiene los datos de los pedidos respectivos de la base de datos.
function getDocsData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var dueño, timestamp, fecha, materia, titulo;
	var nroHojas = 0,
		precio = 0.0;
	bd.collection("Empleados")
		.where("negocioID", "==", user.uid)
		.onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			changes.forEach(change => {
				if (change.type == "added") {
					nombre = change.doc.data().Nombre;
					apellido = change.doc.data().Apellido;
					correo = change.doc.data().email;
					telefono = change.doc.data().telefono;
					setData(nombre, apellido, correo, telefono);
				}
			});
		});
}
//Setea los datos de los pedidos en la tabla respectiva.
function setData(nombre, apellido, correo, telefono) {
	var table = document.getElementsByTagName("table")[0];
	var newRow = table.insertRow(1);

	var nomb = newRow.insertCell(0);
	var apell = newRow.insertCell(1);
	var corr = newRow.insertCell(2);
	var telef = newRow.insertCell(3);
	var eliminar = newRow.insertCell(4);

	nomb.className = "text-center";
	apell.className = "text-center";
	corr.className = "text-center";
	telef.className = "text-center";
	eliminar.className = "text-center";

	$(document).ready(function() {
		var t = $("#example").DataTable();
		t.row
			.add([
				nombre,
				apellido,
				correo,
				telefono,
				`<button id="eliminar" onclick="getDocDet(this)"  class="btn bg-printalo-blueDetail negative">Eliminar</button>`
			])
			.draw(false);
	});
}
//Detalles del pedido seleccionado para rechazar o aceptar el pedido.
function getDocDet(_this) {
	var apellido, nombre, telefono, correo;
	console.log("id : " + _this.id);
	console.log("in");
	apellido = getRowSelected(_this, 0);
	nombre = getRowSelected(_this, 1);
	correo = getRowSelected(_this, 2);
	telefono = getRowSelected(_this, 3);

	if (_this.id === "eliminar") {
		console.log(apellido, nombre, correo, telefono);
	}
}
//Obtiene los datos del nuevo empleado.
function getEmpData() {
	var user = firebase.auth().currentUser;
	var negocioID = user.uid;
	var nombre = document.getElementById("nombre").value;
	var apellido = document.getElementById("apellido").value;
	var telefono = document.getElementById("telefono").value;
	var email = document.getElementById("email").value;
	var contraseña = document.getElementById("contraseña").value;
	var emp = new Empleado(nombre, apellido, email, negocioID, telefono);
	emp.registrar(contraseña);
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
