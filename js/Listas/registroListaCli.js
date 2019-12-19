window.onload = ValidarNeg();
var btnInfo = document.getElementById("info");
btnInfo.addEventListener("click", function() {
	var title = document.getElementById("titleLista").innerHTML;
	var sp = title.split(" ");
	var negocioID = sp[4];
	console.log(negocioID);
	window.location = "./informacionPuesto.html?negocio=" + negocioID;
});
var precio = 0.0;
var negocioID;
//Obtiene los datos de los pedidos respectivos de la base de datos.
async function getDocsData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var dueño, timestamp, fecha, materia, titulo;
	var nroHojas = 0;
	await bd
		.collection("Negocios")
		.where("nombreNeg", "==", nombre)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				negocioID = doc.id;
			});
		})
		.catch(function(error) {
			console.error("No se obtubieron los datos!\n" + error);
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

var titulo, dueño, materia, nroHojas, precio, fecha;
//Detalles del pedido seleccionado para rechazar o aceptar el pedido.
function getDocDet(_this) {
	console.log(_this.id);

	titulo = getRowSelected(_this, 0);
	dueño = getRowSelected(_this, 2);
	materia = getRowSelected(_this, 1);

	var lista = new Lista();
	lista.setDetDoc(dueño, titulo, materia);
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
	console.log(ref);
	var neg = ref.split("=");
	nombre = neg[1];
	document.getElementById("titleLista").innerHTML = "Lista de Negocio de " + nombre;
}
function setConfigs() {
	//Obtiene el valor del color de impresion.
	if (document.getElementById("color").checked) {
		document.getElementById("colorP").checked = true;
		color = false;
	} else {
		document.getElementById("BNP").checked = true;
		color = true;
	}
	//Obtiene el valor del tamanio de hoja.
	if (document.getElementById("carta").checked) {
		tamanio = "carta";
		document.getElementById("cartaP").checked = true;
	} else if (document.getElementById("oficio").checked) {
		tamanio = "oficio";
		document.getElementById("oficioP").checked = true;
	} else {
		tamanio = "A4";
		document.getElementById("a4P").checked = true;
	}
	//Obtiene el tipo de impresion.
	if (document.getElementById("intercalado").checked) {
		impresion = "intercalado";
		document.getElementById("intercaladoP").checked = true;
	} else {
		impresion = "anv/rev";
		document.getElementById("anvP").checked = true;
	}
	//Obtiene el acabado de la impresion.
	if (document.getElementById("engrampado").checked) {
		acabado = "engrampado";
		document.getElementById("engrampadoP").checked = true;
	} else {
		acabado = "normal";
		document.getElementById("normalP").checked = true;
	}

	//Obtiene el tipo de hoja.
	if (document.getElementById("hojaNormal").checked) {
		tipo = "normal";
		document.getElementById("TnormalP").checked = true;
	} else {
		tipo = "reutilizado";
		document.getElementById("TreutilizadoP").checked = true;
	}

	//Obtener la cantidad de copias.
	var cant = parseInt(document.getElementById("paginas").value);
	console.log(cant);
	document.getElementById("paginasP").value = cant;
	document.getElementById("cantidadP").innerHTML = parseFloat(document.getElementById("cantidad").innerHTML);
	calculoCosto();
}
function calculoCosto() {
	document.getElementById("precio1").innerHTML = `<span class="font-weight-bold">Costo total:  </span>` + precio + "Bs.";
	document.getElementById("precio2").innerHTML = `<span class="font-weight-bold">Costo total:  </span>` + precio + "Bs.";
	document.getElementById("precio").innerHTML = `<span class="font-weight-bold">Costo total:  </span>` + precio + "Bs.";
}
//Obtiene la fecha y hora deseada para su entrega.
function getFechaHora() {
	var fecha = document.getElementById("datepicker").value;
	var hora = document.getElementById("timepicker").value;
	timestamp = getTimestamp();
	fecha_hora = fecha + " " + hora;
	return fecha_hora;
}
/*Esta funcion convierte la fecha en un objeto date para luego poder subirla correctamente a 
firebase como objeto timestamp*/
function getTimestamp() {
	var fecha = document.getElementById("datepicker").value;
	var hora = document.getElementById("timepicker").value;
	var f = fecha.split("/");
	var m = f[0];
	var d = f[1];
	var a = f[2];
	timestamp = new Date(a + "-" + m + "-" + d + "T" + hora);
	console.log(timestamp);
	return timestamp;
}
function setPreviewFechas() {
	var sp = getFechaHora().split(" ");
	var fecha = sp[0];
	var hora = sp[1];
	document.getElementById("fechaP").value = fecha;
	document.getElementById("horaP").value = hora;
}
function setPreviewTarjeta() {
	if (document.getElementById("personal").checked) {
		document.getElementById("personalP").checked = true;
		document.getElementById("personalpdiv").style.display = "block";
		document.getElementById("tarjetapdiv").style.display = "none";
		pago = "personal";
	} else {
		pago = "tarjeta";
		document.getElementById("tarjetaP").checked = true;
		document.getElementById("tarjetapdiv").style.display = "block";
		document.getElementById("personalpdiv").style.display = "none";
		getDatosTarjeta();
	}
}
//Obtiene los daos de la tarjeta en caso de ser elegida como metodo de pago.
async function getDatosTarjeta() {
	var bd = firebase.firestore();
	var user = firebase.auth().currentUser;
	var userid = user.uid;
	await bd
		.collection("Clientes")
		.doc(userid)
		.get()
		.then(function(doc) {
			if (doc.exists) {
				nombTarjeta = doc.data().nombTarjeta;
				numTarjeta = doc.data().numTarjeta;
				mes = doc.data().mesTarjeta;
				anio = doc.data().anioTarjeta;
				cvv = doc.data().cvvTarjeta;
				if (nombTarjeta != "" && numTarjeta != "" && mes != "" && anio != "" && cvv != "") {
					document.getElementById("nombTarjeta").value = nombTarjeta;
					document.getElementById("numTarjeta").value = numTarjeta;
					document.getElementById("mes").value = mes;
					document.getElementById("anio").value = anio;
					document.getElementById("cvv").value = cvv;
				} else {
					alert("Datos de tarjeta no configurados!\nPor favor procura configurar los datos de tu tarjeta.");
					location.reload();
				}
			} else {
				console.error("Datos del cliente no hallados!");
			}
		})
		.catch(function(error) {
			console.error("Error obteniendo datos!\n" + error);
		});
}

//Esta es la funcion que cambia el estado del pedido y sube datos adicionales a la base de datos.
function sumitPedido() {
	var numPag = parseFloat(document.getElementById("paginasP").value);
	var cantidad = parseFloat(document.getElementById("cantidadP").innerHTML);
	console.log(
		"Detalles:\n",
		color,
		negocioID,
		tamanio,
		impresion,
		numPag,
		"todo",
		acabado,
		tipo,
		cantidad,
		timestamp,
		titulo,
		materia,
		dueño,
		pago,
		precio
	);
	var pedido = new Pedido();
	pedido.nuevaFot(
		color,
		negocioID,
		tamanio,
		impresion,
		numPag,
		"todo",
		acabado,
		tipo,
		cantidad,
		timestamp,
		titulo,
		materia,
		dueño,
		pago,
		precio
	);
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
