window.onload = ValidarNeg();
var negocioID;
//Obtiene los datos de los pedidos respectivos de la base de datos.
async function getDocsData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var dueño, timestamp, fecha, materia, titulo;
	var nroHojas = 0,
		precio = 0.0;
	await bd
		.collection("Empleados")
		.doc(user.uid)
		.get()
		.then(function(doc) {
			if (doc.exists) {
				negocioID = doc.data().negocioID;
			} else {
				alert("NO SE PUDO HALLAR LOS DATOS!");
			}
		});
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
                class="btn bg-printalo-greenDetail positive"
                data-dismiss="modal"
                data-target="#agregaraLista"
                data-toggle="modal"
                >Editar</button>`,
				`<button id="eliminar" onclick="getDocDet(this)"  class="btn bg-printalo-blueDetail negative">Eliminar</button>`
			])
			.draw(false);
	});
}
//Detalles del pedido seleccionado para rechazar o aceptar el pedido.
function getDocDet(_this) {
	var titulo, dueño, materia, nroHojas, precio, fecha;
	console.log("id : " + _this.id);
	console.log("in");
	titulo = getRowSelected(_this, 0);
	dueño = getRowSelected(_this, 1);
	materia = getRowSelected(_this, 2);
	nroHojas = getRowSelected(_this, 3);
	precio = getRowSelected(_this, 4);
	fecha = getRowSelected(_this, 5);

	var lista = new Empleado();
	if (_this.id === "eliminar") {
		lista.eliminarDoc(negocioID, dueño, titulo);
	} else if (_this.id === "editar") {
		lista.getDocData(negocioID, dueño, titulo);
	}
}
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed, col) {
	var a = objectPressed.parentNode.parentNode;
	var nomb = a.getElementsByTagName("td")[col].innerHTML;
	return nomb;
}

//funciones de botones par ala edicion
function habilitarCamposArchivo() {
	//console.log("here");
	var auxNumHojas = document.getElementById("numHojas").disabled;
	var auxPrecio = document.getElementById("precio").disabled;
	if (auxNumHojas === false && auxPrecio === false) {
		bloquearDatosArchivo();
	} else {
		document.getElementById("numHojas").disabled = false;
		document.getElementById("precio").disabled = false;
	}
	habilitarBtnGuardarCambios();
}
function bloquearDatosArchivo() {
	document.getElementById("numHojas").disabled = true;
	document.getElementById("precio").disabled = true;
}

function habilitarCamposFormulario() {
	//console.log("here");
	var auxNumHojas = document.getElementById("dueño").disabled;
	var auxMat = document.getElementById("materia").disabled;
	var auxTitulo = document.getElementById("tituloDoc").disabled;
	if (auxNumHojas === false && auxMat === false && auxTitulo === false) {
		bloquearDatosFormulario();
	} else {
		document.getElementById("dueño").disabled = false;
		document.getElementById("materia").disabled = false;
		document.getElementById("tituloDoc").disabled = false;
	}
	//habilitarBtnGuardarCambios();
}

function bloquearDatosFormulario() {
	document.getElementById("dueño").disabled = true;
	document.getElementById("materia").disabled = true;
	document.getElementById("tituloDoc").disabled = true;
}
function habilitarBtnGuardarCambios() {
	document.getElementById("btnGuardarCambios").disabled = false;
}

function habilitarBtnRbGuardarCambios() {
	document.getElementById("btnGuardarCambiosRB").disabled = false;
}
function GuardarCambiosEditLista() {
	var btnGuardarCambios = document.getElementById("btnGuardarCambios").disabled;
	if (btnGuardarCambios === false) {
		//console.log("click");
		new Empleado().GuardarCambiosArchivo(negocioID);
		//new Empleado().GuardarCambiosFormulario(negocioID);
		//new Negocio().GuardarCambiosHorario();
		document.getElementById("btnGuardarCambios").disabled = true;
		bloquearDatosArchivo();
		//bloquearDatosGenerales();
		//bloquearDatosAdministrador();
		//bloquearDatosHorario();
	}
}

function GuardarCambiosEditListaRB() {
	var btnGuardarCambios = document.getElementById("btnGuardarCambiosRB").disabled;
	if (btnGuardarCambios === false) {
		console.log("click");
		new Empleado().GuardarCambiosDetallesRB(negocioID);
		document.getElementById("btnGuardarCambios").disabled = true;
		bloquearrRadioButtonsLista();
	}
	console.log("click2");
}

function habilitarRadioButtonsLista() {
	//console.log("here");
	var rbbn = document.getElementById("BN").disabled;
	var rbcolor = document.getElementById("color").disabled;
	var rbcarta = document.getElementById("carta").disabled;
	var rboficio = document.getElementById("oficio").disabled;
	var rba4 = document.getElementById("a4").disabled;
	var rbint = document.getElementById("intercalado").disabled;
	var rbanvrev = document.getElementById("anv/rev").disabled;
	var rbeng = document.getElementById("engrampado").disabled;
	var rbnor = document.getElementById("normal").disabled;
	var rbhojNor = document.getElementById("hojaNormal").disabled;
	var rbhojReu = document.getElementById("hojaReutilizada").disabled;

	if (
		rbbn === false &&
		rbcolor === false &&
		rbcarta === false &&
		rboficio === false &&
		rba4 === false &&
		rbint === false &&
		rbanvrev === false &&
		rbeng === false &&
		rbnor === false &&
		rbhojNor === false &&
		rbhojReu === false
	) {
		bloquearrRadioButtonsLista();
	} else {
		document.getElementById("BN").disabled = false;
		document.getElementById("color").disabled = false;
		document.getElementById("carta").disabled = false;
		document.getElementById("oficio").disabled = false;
		document.getElementById("a4").disabled = false;
		document.getElementById("intercalado").disabled = false;
		document.getElementById("anv/rev").disabled = false;
		document.getElementById("engrampado").disabled = false;
		document.getElementById("normal").disabled = false;
		document.getElementById("hojaNormal").disabled = false;
		document.getElementById("hojaReutilizada").disabled = false;
	}
	habilitarBtnRbGuardarCambios();
}
function bloquearrRadioButtonsLista() {
	document.getElementById("BN").disabled = true;
	document.getElementById("color").disabled = true;
	document.getElementById("carta").disabled = true;
	document.getElementById("oficio").disabled = true;
	document.getElementById("a4").disabled = true;
	document.getElementById("intercalado").disabled = true;
	document.getElementById("anv/rev").disabled = true;
	document.getElementById("engrampado").disabled = true;
	document.getElementById("normal").disabled = true;
	document.getElementById("hojaNormal").disabled = true;
	document.getElementById("hojaReutilizada").disabled = true;
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
