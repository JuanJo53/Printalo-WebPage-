class Empleado extends Usuario {
	constructor(nombre, apellido, correo, negocioID, telefono) {
		super(nombre, apellido, correo);
		this.negocioID = negocioID;
		this.telefono = telefono;
	}
	async registrar(password) {
		console.log(this.nombre, this.apellido, this.telefono, this.correo, password, this.negocioID);
		var auth = new Auth();
		var bd = firebase.firestore();
		var apellido = this.apellido,
			correo = this.correo,
			nombre = this.nombre,
			telefono = this.telefono,
			negocioID = this.negocioID,
			nombreNeg;
		var empleadoID;

		await bd
			.collection("Negocios")
			.doc(negocioID)
			.get()
			.then(function(doc) {
				if (doc.exists) {
					nombreNeg = doc.data().nombreNeg;
				} else {
					console.error("Error al obtener el nombre del negocio!");
				}
			});
		var firebaseConfig = {
			apiKey: "AIzaSyAEFS51wASyzXFPRgosvru8FHm-zvaMzAI",
			authDomain: "printalo-ef2bc.firebaseapp.com",
			databaseURL: "https://printalo-ef2bc.firebaseio.com",
			projectId: "printalo-ef2bc",
			storageBucket: "printalo-ef2bc.appspot.com",
			messagingSenderId: "917705384239",
			appId: "1:917705384239:web:c7bb0ff68990454d84c1da"
		};
		var secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
		await secondaryApp
			.auth()
			.createUserWithEmailAndPassword(this.correo, password)
			.then(function(firebaseUser) {
				secondaryApp.auth().onAuthStateChanged(function(firebaseUser) {
					if (firebaseUser) {
						// User is signed in.
						console.log("User " + firebaseUser.uid + " created successfully!");
						empleadoID = firebaseUser.uid;
					}
				});
			});
		bd.collection("Empleados")
			.doc(empleadoID)
			.set({
				Apellido: apellido,
				email: correo,
				Nombre: nombre,
				telefono: telefono,
				negocioID: negocioID,
				contraseña: password,
				nombreNeg: nombreNeg
			})
			.then(e => {
				location.reload();
				alert("Empleado Añadido!");
			})
			.catch(e => {
				console.log(`Error añadiendo empleado:\n ${error}`);
			});
	}
	rechazarPedidoEmp(negocioID, doc, precio, cant, pago, fecha, hora) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var f = fecha.split("/");
		var d = f[0];
		var m = f[1];
		var a = f[2];
		var timestamp = new Date(a + "-" + m + "-" + d + " " + hora);
		console.log(doc, precio, cant, pago, fecha, hora);
		console.log(timestamp);
		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", doc)
			.where("negocioID", "==", negocioID)
			.where("fechaEntrega", "==", timestamp);
		query
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					bd.collection("Pedido")
						.doc(doc.id)
						.update({
							estado: "porEnviar"
						})
						.then(function() {
							location.reload();
							console.log("Documento se rechazo correctamente");
						});
				});
			})
			.catch(function(error) {
				console.log("Documento no se rechazo correctamente");
			});
	}
	realizarPedidoEmp(negocioID, docN, fechaE, horaE) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var f = fechaE.split("/");
		var d = f[0];
		var m = f[1];
		var a = f[2];
		var timestamp = new Date(a + "-" + m + "-" + d + " " + horaE);

		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", docN)
			.where("negocioID", "==", negocioID)
			.where("fechaEntrega", "==", timestamp);
		query.get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				bd.collection("Pedido")
					.doc(doc.id)
					.update({
						estado: "realizado"
					})
					.then(function() {
						location.reload();
						console.log("Documento se rechazo correctamente");
					});
			});
		});
	}
	async setDatFacturaEmp(negocioID, nitCli, apellido, docNomb, precio, literal, cant, pago, fechaE, horaE) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		var nitNeg,
			nombNeg,
			dirNeg,
			numNeg,
			numFac,
			codControl,
			pedidoID,
			clienteID,
			BN,
			docID,
			acabado,
			fechaPed,
			fechaPedEntrega,
			lados,
			pago,
			paginas,
			tamaño,
			tipo,
			tipoHoja;
		var f = fechaE.split("/");
		var d = f[0];
		var m = f[1];
		var a = f[2];
		var fechaEntrega = new Date(a + "-" + m + "-" + d + " " + horaE);
		var timestamp = firebase.firestore.Timestamp.now().toDate();
		var fecha = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
		await bd
			.collection("Negocios")
			.doc(negocioID)
			.get()
			.then(function(doc) {
				if (doc.exists) {
					nitNeg = doc.data().NIT;
					nombNeg = doc.data().nombreNeg;
					dirNeg = doc.data().dir;
					numNeg = doc.data().fono;
					numFac = Math.floor(Math.random() * 1000000000);
					codControl = Math.floor(Math.random() * 1000000000000);
				} else {
					alert("No existe el documento!");
				}
			})
			.catch(function(error) {
				alert("Error al obtener los datos!\n" + error);
			});
		await bd
			.collection("Pedido")
			.where("negocioID", "==", negocioID)
			.where("nombreDoc", "==", docNomb)
			.where("metodoPago", "==", pago)
			.where("fechaEntrega", "==", fechaEntrega)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					if (doc.exists) {
						pedidoID = doc.id;
						BN = doc.data().blancoYnegro;
						docID = doc.data().docID;
						acabado = doc.data().engrampado;
						fechaPed = doc.data().fecha;
						fechaPedEntrega = doc.data().fechaEntrega;
						clienteID = doc.data().clienteID;
						lados = doc.data().ladosImpre;
						pago = doc.data().metodoPago;
						paginas = doc.data().numPaginas;
						tamaño = doc.data().tamañoHoja;
						tipo = doc.data().tipoDoc;
						tipoHoja = doc.data().tipoHoja;
					} else {
						alert("No existe el documento!HOLA");
					}
				});
			})
			.catch(function(error) {
				alert("Error al obtener los datos!\n" + error);
			});

		document.getElementById("facNombNeg").innerHTML = nombNeg;
		document.getElementById("facDirNeg").innerHTML = dirNeg;
		document.getElementById("facNumNeg").innerHTML = numNeg;
		document.getElementById("nitNeg").innerHTML = nitNeg;
		document.getElementById("numFac").innerHTML = numFac;
		document.getElementById("facFecha").innerHTML = fecha;
		document.getElementById("facNitCli").innerHTML = nitCli;
		document.getElementById("facApllCli").innerHTML = apellido;
		document.getElementById("facDoc").innerHTML = "Impresion: " + docNomb;
		document.getElementById("facCant").innerHTML = cant;
		document.getElementById("facCosto").innerHTML = precio + "Bs.";
		document.getElementById("facTotal").innerHTML = precio + "Bs.";
		document.getElementById("facLitTotal").innerHTML = literal;
		document.getElementById("facCodControl").innerHTML = " " + codControl;
		document.getElementById("facFechaLim").innerHTML = " 31/12/2019";

		var btnImprimir = document.getElementById("btnImprimir");
		btnImprimir.addEventListener("click", f => {
			var venta = new Venta();
			if (nitNeg != "" && nombNeg != "") {
				venta.nuevaVenta(
					numFac,
					timestamp,
					nitCli,
					apellido,
					docNomb,
					cant,
					precio,
					pedidoID,
					clienteID,
					BN,
					docID,
					acabado,
					fechaPed,
					fechaPedEntrega,
					lados,
					pago,
					paginas,
					tamaño,
					tipo,
					tipoHoja
				);
			} else {
				alert(
					"Datos del negocio para emitir factura no configurados!\nPorfavor asegurese de configurarlos antes de imitr una factura!"
				);
			}
		});
	}
	//Setea los detalles del pedido para visualizacion antes de aceptarlo.
	setPedDetEmp(negocioID, docN, usuario, precio, cant, pago, fechaE, horaE) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var color, tam, imp, paginas, acabado, tipo, fecha, hora;
		var f = fechaE.split("/");
		var d = f[0];
		var m = f[1];
		var a = f[2];
		var timestamp = new Date(a + "-" + m + "-" + d + " " + horaE);
		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", docN)
			.where("negocioID", "==", negocioID)
			.where("fechaEntrega", "==", timestamp);
		query
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					document.getElementById("nombreDocD").innerHTML = doc.data().nombreDoc;
					if (doc.data().blancoYnegro === false) {
						document.getElementById("colorD").value = "a Color";
					} else {
						document.getElementById("colorD").value = "Blanco y Negro";
					}
					if (doc.data().tamañoHoja === "carta") {
						document.getElementById("tamanioD").value = "carta";
					} else if (doc.data().tamañoHoja === "oficio") {
						document.getElementById("tamanioD").value = "oficio";
					} else {
						document.getElementById("tamanioD").value = "A4";
					}
					if (doc.data().ladosImpre === "intercalado") {
						document.getElementById("impresionD").value = "intercalado";
					} else {
						document.getElementById("impresionD").value = "anv/rev";
					}
					document.getElementById("numPagD").value = doc.data().numPaginas;
					if (doc.data().engrampado === true) {
						document.getElementById("acabadoD").value = "Si";
					} else {
						document.getElementById("acabadoD").value = "No";
					}
					if (doc.data().tipo === "normal") {
						document.getElementById("tipoHojaD").value = "Hoja Normal";
					} else {
						document.getElementById("tipoHojaD").value = "Hoja Reciclada";
					}
					document.getElementById("cantD").value = doc.data().cantidad;
					if (doc.data().metodoPago === "personal") {
						document.getElementById("pagoD").value = "Personal";
					} else {
						document.getElementById("pagoD").value = "Tarjeta de Credito";
					}
					document.getElementById("clienteD").value = usuario;
					timestamp = new Date(doc.data().fecha.toDate());
					fecha = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
					hora = timestamp.getHours() + ":" + timestamp.getMinutes();
					document.getElementById("fechaD").value = fecha;
					document.getElementById("horaD").value = hora;
					document.getElementById("fEntregaD").value = fechaE;
					document.getElementById("hEntregaD").value = horaE;
					document.getElementById("costoD").value = doc.data().costoTotal;
					document.getElementById("estadoD").value = doc.data().estado;
				});
			})
			.catch(function(error) {
				console.log("No se obtubo los datos del documento correctamente");
			});
	}
	setPedDetEmp(negocioID, docN, usuario, precio, cant, pago, fechaE, horaE) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var color, tam, imp, paginas, acabado, tipo, fecha, hora;
		var f = fechaE.split("/");
		var d = f[0];
		var m = f[1];
		var a = f[2];
		var timestamp = new Date(a + "-" + m + "-" + d + " " + horaE);
		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", docN)
			.where("negocioID", "==", negocioID)
			.where("fechaEntrega", "==", timestamp);
		query
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					document.getElementById("nombreDocD").innerHTML = doc.data().nombreDoc;
					if (doc.data().blancoYnegro === false) {
						document.getElementById("colorD").value = "a Color";
					} else {
						document.getElementById("colorD").value = "Blanco y Negro";
					}
					if (doc.data().tamañoHoja === "carta") {
						document.getElementById("tamanioD").value = "carta";
					} else if (doc.data().tamañoHoja === "oficio") {
						document.getElementById("tamanioD").value = "oficio";
					} else {
						document.getElementById("tamanioD").value = "A4";
					}
					if (doc.data().ladosImpre === "intercalado") {
						document.getElementById("impresionD").value = "intercalado";
					} else {
						document.getElementById("impresionD").value = "anv/rev";
					}
					document.getElementById("numPagD").value = doc.data().numPaginas;
					if (doc.data().engrampado === true) {
						document.getElementById("acabadoD").value = "Si";
					} else {
						document.getElementById("acabadoD").value = "No";
					}
					if (doc.data().tipo === "normal") {
						document.getElementById("tipoHojaD").value = "Hoja Normal";
					} else {
						document.getElementById("tipoHojaD").value = "Hoja Reciclada";
					}
					document.getElementById("cantD").value = doc.data().cantidad;
					if (doc.data().metodoPago === "personal") {
						document.getElementById("pagoD").value = "Personal";
					} else {
						document.getElementById("pagoD").value = "Tarjeta de Credito";
					}
					document.getElementById("clienteD").value = usuario;
					timestamp = new Date(doc.data().fecha.toDate());
					fecha = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
					hora = timestamp.getHours() + ":" + timestamp.getMinutes();
					document.getElementById("fechaD").value = fecha;
					document.getElementById("horaD").value = hora;
					document.getElementById("fEntregaD").value = fechaE;
					document.getElementById("hEntregaD").value = horaE;
					document.getElementById("costoD").value = doc.data().costoTotal;
					document.getElementById("estadoD").value = doc.data().estado;
				});
			})
			.catch(function(error) {
				console.log("No se obtubo los datos del documento correctamente");
			});
	}
	aceptarPedidoEmp(negocioID) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var docN = document.getElementById("nombreDocD").innerHTML;
		var fechaE = document.getElementById("fEntregaD").value;
		var horaE = document.getElementById("hEntregaD").value;
		var f = fechaE.split("/");
		var d = f[0];
		var m = f[1];
		var a = f[2];
		var timestamp = new Date(a + "-" + m + "-" + d + " " + horaE);

		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", docN)
			.where("negocioID", "==", negocioID)
			.where("fechaEntrega", "==", timestamp);
		query.get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				bd.collection("Pedido")
					.doc(doc.id)
					.update({
						estado: "pendiente"
					})
					.then(function() {
						location.reload();
						console.log("Documento se rechazo correctamente");
					});
			});
		});
	}
}
