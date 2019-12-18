window.onload = ValidarCli();
//Esta funcion optiene la extension del documento.
function getFileExtension(filename) {
	return filename.split(".").pop();
}
var count = 0;
//Evento al añadir nuevo documento.
var fileButton = document.getElementById("my-file");
fileButton.addEventListener("change", function(e) {
	var storage = firebase.storage();
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	//Get file
	var file = e.target.files[0];
	//Obtiene la cantidad de paginas del documento que se esta por enviar.
	var input = document.getElementById("my-file");
	var reader = new FileReader();

	perc = 0.0;
	reader.readAsBinaryString(input.files[0]);
	reader.onloadend = function() {
		count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
		console.log("Number of Pages:", count);
	};
	//Agrega metadata al documento por subir
	var metadata = {
		name: file.name
	};
	//Crea la referencia a un storage especifico.
	var storageRef = storage.ref();

	var task = storageRef.child("docsPedidos/" + user.uid + "/" + file.name).put(file, metadata);
	$("#progress").click();
	task.on(
		"state_changed",
		function progress(snapshot) {
			perc = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			var progreso = document.getElementsByClassName("progress-bar")[0];
			setInterval(() => {
				progreso.style.setProperty("--width", perc + 0.1);
			}, 5);
			console.log(perc);
			if (perc === 100) {
				$("#progress").click();
			}
		},
		function error(err) {
			console.log("Error: " + err);
		},
		function() {
			task.snapshot.ref.getDownloadURL().then(url => {
				console.log("Mostrar: " + url);
				bd.collection("Pedido").add({
					blancoYnegro: false,
					cantidad: 0,
					clienteID: user.uid,
					docID: url,
					engrampado: false,
					estado: "porEnviar",
					fecha: firebase.firestore.FieldValue.serverTimestamp(),
					fechaEntrega: firebase.firestore.FieldValue.serverTimestamp(),
					ladosImpre: "",
					metodoPago: "",
					negocioID: "",
					nombreDoc: file.name,
					numPaginas: count,
					paginas: true,
					tamañoHoja: "",
					tipoDoc: getFileExtension(file.name),
					tipoHoja: ""
				});
			});
		}
	);
	setData(getFileExtension(file.name), file.name);
});
//Coloca la imagen y nombre de los negocios disponibles.
function setNegocios() {
	var bd = firebase.firestore();
	var string = "";
	bd.collection("Negocios")
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				string +=
					`<div class="pb-3 text-center puesto" data-dismiss="modal" data-toggle="modal"
                        data-target="#configurarPedido">
                        <div id="` +
					doc.data().nombreNeg +
					`" onclick="getNeg(this)" class="card negocioIcon mx-auto">
                            <div class="img-puesto">
                                <!--img del negocio-->
                                <img src="../../../img/pcs.jpg" alt="" class="card-img-top">
                                <!--//img del negocio-->
                            </div>
                            <div class="card-footer">
                                <!--nombre del negocio-->
                                <h5  class="my-auto text-light">` +
					doc.data().nombreNeg +
					`</h5>
                                <!--//nombre del negocio-->
                            </div>
                        </div>
                    </div>`;
				var negocios = document.getElementById("Negocios");
				negocios.innerHTML = string;
			});
		})
		.catch(function(error) {
			console.log("Error obteniendo los negocios: ", error);
		});
}

//Obtiene de la base de datos el nombre del documento en el pedido registrado previamente.
function getDocData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	bd.collection("Pedido")
		.where("clienteID", "==", user.uid)
		.where("estado", "==", "porEnviar")
		.orderBy("fecha")
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				//Pasa el nombre a la funcion setData que lo adiciona a la tabla para la vista facil del usuario.
				setData(doc.data().tipoDoc, doc.data().nombreDoc);
			});
		})
		.catch(function(error) {
			console.log("Error obteniendo los documentos: ", error);
		});
}
//ESta funcion es la que adiciona los datos necesarios para llenar la tabla de pedidos adicionados.
function setData(type, name) {
	var table = document.getElementsByTagName("table")[0];
	var newRow = table.insertRow(1);

	var tipo = newRow.insertCell(0);
	var nombArch = newRow.insertCell(1);
	var solic = newRow.insertCell(2);
	var elim = newRow.insertCell(3);

	var icon = document.createElement("i");

	tipo.className = "text-center";
	nombArch.className = "text-center";
	solic.className = "text-center";
	elim.className = "text-center";

	if (type === "pdf") {
		// TODO: Configurar para multiples iconos
		icon.className = "far fa-file-pdf fa-3x";
		tipo.appendChild(icon);
	}

	nombArch.innerHTML = name;
	solic.innerHTML = `<button onclick="getDocNomb(this)"  
						class="btn positive bg-printalo-greenDetail text-light" 
						data-toggle="modal" data-target="#escogerLocal">
                        Solicitar
                    </button>`;
	elim.innerHTML = `<button onclick="new Pedido().eliminarPedido(this)" 
						class="btn negative bg-printalo-blueDetail text-light" 
						data-toggle="modal" data-target="#eliminateAlert">
                        Eliminar
                    </button>`;
}

var negocioID,
	nombreDoc,
	paginas,
	rangoInf,
	rangoSup,
	fecha_hora,
	timestamp,
	color,
	tamanio,
	impresion,
	acabado,
	tipo,
	pago,
	nombTarjeta,
	numTarjeta,
	mes,
	anio,
	cvv;
var cantidad = 0;
var numPag = 0;
var costoTotal = 0.0;

//Al apretar alguno de los documentos para solicitar.
function getDocNomb(_this) {
	nombreDoc = getRowSelected(_this);
	console.log(nombreDoc);
}
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed) {
	var a = objectPressed.parentNode.parentNode;
	var nomb = a.getElementsByTagName("td")[1].innerHTML;
	return nomb;
}
//Obtiene el Negocio elegido.
function getNeg(objectPressed) {
	negocioID = objectPressed.id;
	console.log(negocioID);
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
					alert(
						"Datos de tarjeta no configurados!\nPor favor procura configurar los datos de tu tarjeta."
					);
				}
			} else {
				console.error("Datos del cliente no hallados!");
			}
		})
		.catch(function(error) {
			console.error("Error obteniendo datos!\n" + error);
		});
}
//Muestra la pre vista de todos lo parametros seleccionados.
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
	//Obtiene el detalle de las paginas.
	if (document.getElementById("todo").checked) {
		paginas = "todo";
		document.getElementById("todoP").checked;
	} else {
		paginas = "personalizado";
		document.getElementById("personalizadoP").checked;
		//Obtiene el rango inferior de las hojas.
		var inf = document.getElementById("rangoInf").value;
		//Obtiene el rango superior de las hojas.
		var sup = document.getElementById("rangoSup").value;
		rangoInf = inf;
		rangoSup = sup;
		document.getElementById("personalizadopdiv").style.display = "block";
		document.getElementById("todopdiv").style.display = "none";
		document.getElementById("rangoInfP").value = parseInt(inf);
		document.getElementById("rangoSupP").value = parseInt(sup);
	}

	//Obtiene el acabado de la impresion.
	if (document.getElementById("acabado").checked) {
		acabado = "engrampado";
		document.getElementById("engrampadoP").checked = true;
	} else {
		acabado = "normal";
		document.getElementById("normalP").checked = true;
	}

	//Obtiene el tipo de hoja.
	if (document.getElementById("TipoHoja").checked) {
		tipo = "normal";
		document.getElementById("TnormalP").checked = true;
	} else {
		tipo = "reutilizado";
		document.getElementById("TreutilizadoP").checked = true;
	}

	//Obtener la cantidad de copias.
	var cant = document.getElementById("cantidad").value;
	document.getElementById("cantidadP").value = cant;
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
//Muestra el costo toal en las 3 partes respectivas.
async function previewCosto() {
	setConfigs();
	if (document.getElementById("todo").checked) {
		var bd = firebase.firestore();
		await bd
			.collection("Pedido")
			.where("nombreDoc", "==", nombreDoc)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					numPag = doc.data().numPaginas;
					console.log(numPag);
					calculoCosto(numPag, costoTam, costoTipo, costoColor);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
	} else {
		rangoInf = document.getElementById("rangoInfP").value;
		rangoSup = document.getElementById("rangoSupP").value;
		numPag = rangoSup - rangoInf + 1;
	}
	cantidad = parseInt(document.getElementById("cantidadP").value);
	getCosto();
}
var costoColor = 0.0;
var costoTam = 0.0;
var costoTipo = 0.0;
//Calcula el costo total por el pedido dependiendo de sus parametros.
async function getCosto() {
	var bd = firebase.firestore();
	//Obtiene el costo por impresio (color/bn) del negocio que se eligio.
	if (document.getElementById("colorP").checked) {
		await bd
			.collection("Negocios")
			.where("nombreNeg", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					costoColor = doc.data().costoColor;
					console.log(costoColor);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
	} else {
		await bd
			.collection("Negocios")
			.where("nombreNeg", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					costoColor = doc.data().costoBN;
					console.log(costoColor);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
	}
	//Obtiene el costo por tamaño de hoja del negocio que se eligio.
	if (document.getElementById("cartaP").checked) {
		await bd
			.collection("Negocios")
			.where("nombreNeg", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					costoTam = doc.data().costoTamHoja.Carta;
					console.log(costoTam);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
	} else if (document.getElementById("oficioP").checked) {
		await bd
			.collection("Negocios")
			.where("nombreNeg", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					costoTam = doc.data().costoTamHoja.Oficio;
					console.log(costoTam);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
	} else {
		await bd
			.collection("Negocios")
			.where("nombreNeg", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					costoTam = doc.data().costoTamHoja.A4;
					console.log(costoTam);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
	}
	//Obtiene el costo por tipo de hoja del negocio que se eligio.
	if (document.getElementById("TnormalP").checked) {
		await bd
			.collection("Negocios")
			.where("nombreNeg", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					costoTipo = doc.data().costoTipoHoja.normal;
					console.log(costoTipo);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
	} else {
		await bd
			.collection("Negocios")
			.where("nombreNeg", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					costoTipo = doc.data().costoTipoHoja.reutilizable;
					console.log(costoTipo);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
	}
	//Verifica el tipo
	if (document.getElementById("todo").checked) {
		await bd
			.collection("Pedido")
			.where("nombreDoc", "==", nombreDoc)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					numPag = doc.data().numPaginas;
					calculoCosto(numPag, costoTam, costoTipo, costoColor);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
	} else {
		numPag = rangoSup - rangoInf + 1;
		calculoCosto(numPag, costoTam, costoTipo, costoColor);
	}
}
//Calculo del costo total respecto de los parametros adicionales.
function calculoCosto(pag, ctam, ctip, cCol) {
	costoTotal = Math.round((ctam + ctip + cCol) * pag * cantidad * 100, -1) / 100;
	console.log("hola", costoTotal);
	document.getElementById("operacion1").innerHTML =
		"(" +
		ctam +
		"+" +
		ctip +
		"+" +
		cCol +
		")" +
		" X " +
		pag +
		" X " +
		cantidad +
		"= " +
		costoTotal +
		"Bs.";
	document.getElementById("operacion").innerHTML =
		"(" +
		ctam +
		"+" +
		ctip +
		"+" +
		cCol +
		")" +
		"X" +
		pag +
		"X" +
		cantidad +
		"= " +
		costoTotal +
		"Bs.";
	document.getElementById("operacion2").innerHTML =
		"(" +
		ctam +
		"+" +
		ctip +
		"+" +
		cCol +
		")" +
		"X" +
		pag +
		"X" +
		cantidad +
		"= " +
		costoTotal +
		"Bs.";
	document.getElementById("total").innerHTML =
		`<span class="font-weight-bold">Costo total:  </span>` + costoTotal + "Bs.";
	document.getElementById("total1").innerHTML =
		`<span class="font-weight-bold">Costo total:  </span>` + costoTotal + "Bs.";
	document.getElementById("total2").innerHTML =
		`<span class="font-weight-bold">Costo total:  </span>` + costoTotal + "Bs.";
}
//Esta es la funcion que cambia el estado del pedido y sube datos adicionales a la base de datos.
function sumitPedido() {
	console.log(
		"Detalles:\n",
		color,
		negocioID,
		tamanio,
		impresion,
		numPag,
		paginas,
		acabado,
		tipo,
		cantidad,
		timestamp,
		numTarjeta,
		nombTarjeta,
		mes,
		pago,
		anio,
		cvv,
		costoTotal
	);
	var pedido = new Pedido();
	pedido.nuevoPedido(
		color,
		negocioID,
		tamanio,
		impresion,
		numPag,
		paginas,
		acabado,
		tipo,
		cantidad,
		timestamp,
		numTarjeta,
		nombTarjeta,
		mes,
		pago,
		anio,
		cvv,
		costoTotal
	);
}

// Esta funcion ejecuta el observador de firebase
function ValidarCli() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			getDocData();
			setNegocios();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/usuarioIndex/indexUser.html";
		}
	});
}
