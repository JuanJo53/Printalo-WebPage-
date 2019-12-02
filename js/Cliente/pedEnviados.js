window.onload = ValidarCli();
//Esta funcion obtiene los datos del pedido de la base de datos.
function getDocData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	bd.collection("Pedido")
		.where("clienteID", "==", user.uid)
		.where("estado", "==", "solicitado")
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
		`" onclick="getDocDet(this)" 
                        class="btn positive bg-printalo-greenDetail text-light" data-toggle="modal" data-target="#escogerLocal">
                        Detalles
                    </button>`;
	elim.className = "text-center";
	elim.innerHTML = `<button class="btn negative bg-printalo-blueDetail text-light" data-toggle="modal" data-target="#checkAlert">
                        Eliminar
                    </button>`;
}

function getDocDet() {}
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed) {
	var a = objectPressed.parentNode.parentNode;
	var nomb = a.getElementsByTagName("td")[1].innerHTML;
	return nomb;
}
// Esta funcion ejecuta el observador de firebase
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
