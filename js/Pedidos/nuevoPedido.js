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

var negocioID;
var nombreDoc;
var color;
var tamanio;
var impresion;
var paginas;
var numPag = 0;
var rangoInf, rangoSup;
var acabado;
var tipo;
var cantidad;
var fecha_hora;
var pago;
var nombTarjeta, numTarjeta, mes, anio, cvv;
var costoTotal = 0.0;
var timestamp;

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
	let timestamp = new Date(a + "-" + m + "-" + d + "T" + hora);
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
					console.log(nombTarjeta, numTarjeta, mes, anio, cvv);
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
	} else {
		document.getElementById("BNP").checked = true;
	}
	//Obtiene el valor del tamanio de hoja.
	if (document.getElementById("carta").checked) {
		document.getElementById("cartaP").checked = true;
	} else if (document.getElementById("oficio").checked) {
		document.getElementById("oficioP").checked = true;
	} else {
		document.getElementById("a4P").checked = true;
	}
	//Obtiene el tipo de impresion.
	if (document.getElementById("intercalado").checked) {
		document.getElementById("intercaladoP").checked = true;
	} else {
		document.getElementById("anvP").checked = true;
	}
	//Obtiene el detalle de las paginas.
	if (document.getElementById("todo").checked) {
		document.getElementById("todoP").checked;
	} else {
		document.getElementById("personalizadoP").checked;
		//Obtiene el rango inferior de las hojas.
		var inf = document.getElementById("rangoInf").value;
		//Obtiene el rango superior de las hojas.
		var sup = document.getElementById("rangoSup").value;
		document.getElementById("personalizadopdiv").style.display = "block";
		document.getElementById("todopdiv").style.display = "none";
		document.getElementById("rangoInfP").value = parseInt(inf);
		document.getElementById("rangoSupP").value = parseInt(sup);
	}

	//Obtiene el acabado de la impresion.
	if (document.getElementById("acabado").checked) {
		document.getElementById("engrampadoP").checked = true;
	} else {
		document.getElementById("normalP").checked = true;
	}

	//Obtiene el tipo de hoja.
	if (document.getElementById("TipoHoja").checked) {
		document.getElementById("TnormalP").checked = true;
	} else {
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
	} else {
		document.getElementById("tarjetaP").checked = true;
		document.getElementById("tarjetapdiv").style.display = "block";
		document.getElementById("personalpdiv").style.display = "none";
		getDatosTarjeta();
	}
}
//Muestra el costo toal en las 3 partes respectivas.
//TODO: Controlar reseteo de cantidad de paginas.
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
	//Obtiene el costo por impresio (color/bn) del negocio que se eligio.
	if (color === false) {
		var bd = firebase.firestore();
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
	} else {
		var bd = firebase.firestore();
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
	}
	//Obtiene el costo por tamaño de hoja del negocio que se eligio.
	if (tamanio === "carta") {
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
	} else if (tamanio === "oficio") {
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
	if (tipo === "normal") {
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
		var user = firebase.auth().currentUser;
		var query = await bd
			.collection("Pedido")
			.where("nombreDoc", "==", nombreDoc)
			.where("clienteID", "==", user.uid);
		query
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					bd.collection("Pedido")
						.doc(doc.id)
						.update({
							numPaginas: numPag
						});
					calculoCosto(numPag, costoTam, costoTipo, costoColor);
				});
			})
			.catch(function(error) {
				console.log("Error obteniendo los documentos: ", error);
			});
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
	var bd = firebase.firestore();
	var user = firebase.auth().currentUser;
	var neg;
	var negQuery = bd.collection("Negocios").where("nombreNeg", "==", negocioID);
	negQuery
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				neg = doc.id;
				var query = bd
					.collection("Pedido")
					.where("nombreDoc", "==", nombreDoc)
					.where("clienteID", "==", user.uid);
				query
					.get()
					.then(function(querySnapshot) {
						querySnapshot.forEach(function(doc) {
							bd.collection("Pedido")
								.doc(doc.id)
								.update({
									blancoYnegro: color,
									cantidad: cantidad,
									costoTotal: costoTotal,
									engrampado: acabado,
									estado: "solicitado",
									fechaEntrega: timestamp,
									ladosImpre: impresion,
									metodoPago: pago,
									negocioID: neg,
									numPaginas: numPag,
									paginas: paginas,
									tamañoHoja: tamanio,
									tipoHoja: tipo
								})
								.then(function() {
									location.reload();
								});
						});
					})
					.catch(function(error) {
						console.log("Error obteniendo los documentos: ", error);
					});
			});
		})
		.catch(function(error) {
			console.log(error);
		});
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
