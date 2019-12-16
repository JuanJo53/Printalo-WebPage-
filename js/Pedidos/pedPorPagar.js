window.onload = ValidarCli();
//Esta funcion obtiene los datos del pedido de la base de datos.
function getDocData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var nomb,
		arch,
		precio,
		cant = 0,
		pago = "",
		fecha = "",
		hora = "",
		timestamp;
	bd.collection("Pedido")
		.where("negocioID", "==", user.uid)
		.where("estado", "==", "realizado")
		.where("metodoPago", "==", "personal")
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
				`<div class="color-printalo-greenDetail"><i
        class="far fa-check-square fa-2x"></i></div>`,
				`<button id="detalles" href="" onclick="getPedDet(this)" class="btn bg-printalo-greenDetail positive" data-dismiss="modal"
        data-target="#modalVerDetalles" data-toggle="modal">Detalles</button>`,
				`<button id="entregar" onclick="getPedDet(this)" href="" class="btn bg-printalo-greenDetail positive" data-dismiss="modal"
        data-target="#entregarPedido" data-toggle="modal">Entregar</button>`
			])
			.draw(false);
	});
}
//Obtiene los detalles del documento seleccionado en los pedidos enviados.
function getDocDet(_this) {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var docNomb = getRowSelected(_this);
	var timestamp, fecha, hora;
	bd.collection("Pedido")
		.where("clienteID", "==", user.uid)
		.where("estado", "==", "realizado")
		.where("nombreDoc", "==", docNomb)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				if (doc.data().blancoYnegro === false) {
					document.getElementById("colorP").checked = true;
				} else {
					document.getElementById("BNP").checked = true;
				}
				if (doc.data().tamañoHoja === "carta") {
					document.getElementById("cartaP").checked = true;
				} else if (doc.data().tamañoHoja === "oficio") {
					document.getElementById("oficioP").checked = true;
				} else {
					document.getElementById("a4P").checked = true;
				}
				if (doc.data().ladosImpre === "intercalado") {
					document.getElementById("intercaladoP").checked = true;
				} else {
					document.getElementById("anvP").checked = true;
				}
				document.getElementById("paginas").value = doc.data().numPaginas;
				if (doc.data().engrampado === "normal") {
					document.getElementById("normalP").checked = true;
				} else {
					document.getElementById("engrampadoP").checked = true;
				}
				if (doc.data().tipo === "normal") {
					document.getElementById("TnormalP").checked = true;
				} else {
					document.getElementById("TreutilizadoP").checked = true;
				}
				document.getElementById("cantidadP").value = doc.data().cantidad;
				if (doc.data().metodoPago === "personal") {
					document.getElementById("personalP").checked = true;
				} else {
					document.getElementById("tarjetaP").checked = true;
				}
				timestamp = new Date(doc.data().fechaEntrega.toDate());
				fecha =
					timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
				hora = timestamp.getHours() + ":" + timestamp.getMinutes();
				document.getElementById("fechaP").value = fecha;
				document.getElementById("horaP").value = hora;
				document.getElementById("costo").value = doc.data().costoTotal;
			});
		});
}
//Detalles del pedido seleccionado para rechazar o aceptar el pedido.
function getPedDet(_this) {
	var doc, cant, usuario, fechaE, horaE, pago, precio;

	var pedido = new Pedido();
	console.log(_this.id);

	doc = getRowSelected(_this, 0);
	usuario = getRowSelected(_this, 1);
	precio = getRowSelected(_this, 2);
	cant = getRowSelected(_this, 3);
	pago = getRowSelected(_this, 4);
	fechaE = getRowSelected(_this, 5);
	horaE = getRowSelected(_this, 6);
	if (_this.id === "detalles") {
		pedido.setPedDet(doc, usuario, precio, cant, pago, fechaE, horaE);
	} else {
		presetFac(doc, precio, cant, pago, fechaE, horaE);
	}
}
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed, col) {
	var a = objectPressed.parentNode.parentNode;
	var nomb = a.getElementsByTagName("td")[col].innerHTML;
	return nomb;
}
function presetFac(doc, precio, cant, pago, fechaE, horaE) {
	var imprFac = document.getElementById("imprimirFac");
	imprFac.addEventListener("click", f => {
		var apellido = document.getElementById("apllCli").value;
		var nit = document.getElementById("nitCli").value;
		var precioLit = NumeroALetras(precio);
		var pedido = new Pedido();
		pedido.setDatFactura(nit, apellido, doc, precio, precioLit, cant, pago, fechaE, horaE);
	});
}
function Unidades(num) {
	switch (num) {
		case 1:
			return "UN";
		case 2:
			return "DOS";
		case 3:
			return "TRES";
		case 4:
			return "CUATRO";
		case 5:
			return "CINCO";
		case 6:
			return "SEIS";
		case 7:
			return "SIETE";
		case 8:
			return "OCHO";
		case 9:
			return "NUEVE";
	}

	return "";
} //Unidades()

function Decenas(num) {
	decena = Math.floor(num / 10);
	unidad = num - decena * 10;

	switch (decena) {
		case 1:
			switch (unidad) {
				case 0:
					return "DIEZ";
				case 1:
					return "ONCE";
				case 2:
					return "DOCE";
				case 3:
					return "TRECE";
				case 4:
					return "CATORCE";
				case 5:
					return "QUINCE";
				default:
					return "DIECI" + Unidades(unidad);
			}
		case 2:
			switch (unidad) {
				case 0:
					return "VEINTE";
				default:
					return "VEINTI" + Unidades(unidad);
			}
		case 3:
			return DecenasY("TREINTA", unidad);
		case 4:
			return DecenasY("CUARENTA", unidad);
		case 5:
			return DecenasY("CINCUENTA", unidad);
		case 6:
			return DecenasY("SESENTA", unidad);
		case 7:
			return DecenasY("SETENTA", unidad);
		case 8:
			return DecenasY("OCHENTA", unidad);
		case 9:
			return DecenasY("NOVENTA", unidad);
		case 0:
			return Unidades(unidad);
	}
} //Unidades()

function DecenasY(strSin, numUnidades) {
	if (numUnidades > 0) return strSin + "Y" + Unidades(numUnidades);

	return strSin;
} //DecenasY()

function Centenas(num) {
	centenas = Math.floor(num / 100);
	decenas = num - centenas * 100;

	switch (centenas) {
		case 1:
			if (decenas > 0) return "CIEN" + Decenas(decenas);
			return "CIEN";
		case 2:
			return "DOSCIENTOS" + Decenas(decenas);
		case 3:
			return "TRESCIENTOS" + Decenas(decenas);
		case 4:
			return "CUATROCIENTOS" + Decenas(decenas);
		case 5:
			return "QUINIENTOS" + Decenas(decenas);
		case 6:
			return "SEISCIENTOS" + Decenas(decenas);
		case 7:
			return "SETECIENTOS" + Decenas(decenas);
		case 8:
			return "OCHOCIENTOS" + Decenas(decenas);
		case 9:
			return "NOVECIENTOS" + Decenas(decenas);
	}

	return Decenas(decenas);
} //Centenas()

function Seccion(num, divisor, strSingular, strPlural) {
	cientos = Math.floor(num / divisor);
	resto = num - cientos * divisor;

	letras = "";

	if (cientos > 0)
		if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
		else letras = strSingular;

	if (resto > 0) letras += "";

	return letras;
} //Seccion()

function Miles(num) {
	divisor = 1000;
	cientos = Math.floor(num / divisor);
	resto = num - cientos * divisor;

	strMiles = Seccion(num, divisor, "UN MIL", "MIL");
	strCentenas = Centenas(resto);

	if (strMiles == "") return strCentenas;

	return strMiles + " " + strCentenas;
} //Miles()

function Millones(num) {
	divisor = 1000000;
	cientos = Math.floor(num / divisor);
	resto = num - cientos * divisor;

	strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
	strMiles = Miles(resto);

	if (strMillones == "") return strMiles;

	return strMillones + " " + strMiles;
} //Millones()

function NumeroALetras(num) {
	var data = {
		numero: num,
		enteros: Math.floor(num),
		centavos: Math.round(num * 100) - Math.floor(num) * 100,
		letrasCentavos: "",
		letrasMonedaPlural: "BOLIVIANO", //“PESOS”, 'Dólares', 'Bolívares', 'etcs'
		letrasMonedaSingular: "BOLIVIANO", //“PESO”, 'Dólar', 'Bolivar', 'etc'

		letrasMonedaCentavoPlural: "CENTAVOS",
		letrasMonedaCentavoSingular: "CENTAVO"
	};

	if (data.centavos > 0) {
		data.letrasCentavos =
			"CON " +
			(function() {
				if (data.centavos == 1)
					return Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
				else return Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
			})();
	}

	if (data.enteros == 0) return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
	if (data.enteros == 1)
		return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
	else return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
} //NumeroALetras()
//Esta funcion ejecuta el observador de firebase
function ValidarCli() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			getDocData();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/usuarioIndex/indexUser.html";
		}
	});
}
