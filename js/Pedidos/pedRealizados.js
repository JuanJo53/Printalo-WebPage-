window.onload = ValidarCli();
//Esta funcion obtiene los datos del pedido de la base de datos.
function getDocData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	bd.collection("Pedido")
		.where("clienteID", "==", user.uid)
		.where("estado", "==", "realizado")
		.orderBy("fecha")
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				setData(doc.data().tipoDoc, doc.data().nombreDoc);
			});
		})
		.catch(function(error) {
			console.log("Error obteniendo los documentos: ", error);
		});
}
//Esta funcion pone los datos dentro la tabla especificada.
function setData(type, name) {
	var table = document.getElementsByTagName("table")[0];
	var newRow = table.insertRow(1);

	var tipo = newRow.insertCell(0);
	var nombArch = newRow.insertCell(1);
	var solic = newRow.insertCell(2);
	var elim = newRow.insertCell(3);

	var icon = document.createElement("i");

	if (type === "pdf") {
		// TODO: Configurar para multiples iconos
		icon.className = "far fa-file-pdf fa-3x";
		tipo.appendChild(icon);
	}
	tipo.className = "text-center";

	nombArch.className = "text-center";
	nombArch.innerHTML = name;

	solic.className = "text-center";
	solic.innerHTML =
		`<button id="btnSol/` +
		(table.rows.length - 1) +
		`"  
		class="btn positive bg-printalo-greenDetail text-light"
		data-toggle="modal" data-target="#detallesPedido">
                        Detalles
                    </button>`;
	elim.className = "text-center";
	elim.innerHTML = `<button onclick="new Pedido().cancelarPedido(this)" 
						class="btn negative bg-printalo-blueDetail text-light" 
						data-toggle="modal" data-target="#checkAlert">
                        Cancelar
                    </button>`;
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
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed) {
	var a = objectPressed.parentNode.parentNode;
	var nomb = a.getElementsByTagName("td")[1].innerHTML;
	return nomb;
}
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
