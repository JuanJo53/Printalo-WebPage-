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
	//Hace el cambio de estado de un pedido para representar el hecho de que el pedido YA fue realizado.
	imprPedidoEmp(negocioID) {
		var bd = firebase.firestore();
		var docN = document.getElementById("nombreDocD").innerHTML;
		var fechaE = document.getElementById("fEntregaD").value;
		var horaE = document.getElementById("hEntregaD").value;
		var f = fechaE.split("/");
		var d = f[0];
		var m = f[1];
		var a = f[2];
		var timestamp = new Date(a + "-" + m + "-" + d + " " + horaE);

		var storage = firebase.storage();

		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", docN)
			.where("negocioID", "==", negocioID)
			.where("fechaEntrega", "==", timestamp);
		query.get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				bd.collection("Pedido")
					.doc(doc.id)
					.get()
					.then(function() {
						if (doc.exists) {
							var docRef = storage.ref("docsPedidos/" + doc.data().clienteID + "/" + doc.data().nombreDoc);
							docRef
								.getDownloadURL()
								.then(function(url) {
									console.log(url);
									window.open(url);
								})
								.catch(function(error) {
									console.log("No se obtuvo el link correctamente");
								});
							console.log("Documento se descargo correctamente");
						} else {
							console.log("Documento no existe");
						}
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
	setPedDetEmp(negocioID, docN, usuario, fechaE, horaE) {
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
	eliminarDoc(negocioID, dueño, titulo) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		bd.collection("Listas")
			.where("negocioID", "==", negocioID)
			.where("dueño", "==", dueño)
			.where("nombreDoc", "==", titulo)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					if (doc.exists) {
						bd.collection("Listas")
							.doc(doc.id)
							.delete()
							.then(function() {
								alert("Documento se borro correctamente");
								location.reload();
							});
					} else {
						alert("Documento no encontrado!");
					}
				});
			})
			.catch(function(error) {
				alert("Documento no se borro correctamente!\n" + error);
			});
	}
	async getDocData(negocioID, dueño, titulo) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		var nroHojas = 0,
			precio = 0.0,
			fecha,
			hora,
			timestamp,
			color,
			tamaño,
			impresion,
			acabado,
			tipoHoja,
			materia;
		await bd
			.collection("Listas")
			.where("negocioID", "==", negocioID)
			.where("dueño", "==", dueño)
			.where("nombreDoc", "==", titulo)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					if (doc.exists) {
						nroHojas = doc.data().numHojas;
						precio = doc.data().precio;
						dueño = doc.data().dueño;
						materia = doc.data().materia;
						titulo = doc.data().nombreDoc;
						timestamp = new Date(doc.data().fecha.toDate());
						fecha = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
						hora = timestamp.getHours() + ":" + timestamp.getMinutes();
						color = doc.data().color;
						tamaño = doc.data().tamañoHoja;
						impresion = doc.data().impresion;
						acabado = doc.data().acabado;
						tipoHoja = doc.data().tipoHoja;
					} else {
						alert("Documento no encontrado!");
					}
				});
			})
			.catch(function(error) {
				alert("Documento no se obtuvo correctamente!\n" + error);
			});
		document.getElementById("numHojas").value = nroHojas;
		document.getElementById("precio").value = precio;
		document.getElementById("dueño").value = dueño;
		document.getElementById("fecha").value = fecha;
		document.getElementById("hora").value = hora;
		document.getElementById("materia").value = materia;
		document.getElementById("tituloDoc").value = titulo;
		if (color === "color") {
			document.getElementById("color").checked = true;
		} else {
			document.getElementById("BN").checked = true;
		}
		if (tamaño === "carta") {
			document.getElementById("carta").checked = true;
		} else if (tamaño === "oficio") {
			document.getElementById("oficio").checked = true;
		} else {
			document.getElementById("a4").checked = true;
		}
		if (impresion === "intercalado") {
			document.getElementById("intercalado").checked = true;
		} else {
			document.getElementById("anv/rev").checked = true;
		}
		if (acabado === "engrampado") {
			document.getElementById("intercalado").checked = true;
		} else {
			document.getElementById("normal").checked = true;
		}
		if (tipoHoja === "normal") {
			document.getElementById("hojaNormal").checked = true;
		} else {
			document.getElementById("hojaReutilizada").checked = true;
		}
	}

	editarDoc(negocioID, dueño, titulo) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		bd.collection("Listas")
			.where("negocioID", "==", negocioID)
			.where("dueño", "==", dueño)
			.where("nombreDoc", "==", titulo)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					if (doc.exists) {
						document.getElementById("numHojas").value = nroHojas;
						document.getElementById("precio").value = precio;
						document.getElementById("dueño").value = dueño;
						document.getElementById("fecha").value = fecha;
						document.getElementById("materia").value = materia;
						document.getElementById("tituloDoc").value = titulo;
					} else {
						alert("Documento no encontrado!");
					}
				});
			})
			.catch(function(error) {
				alert("Documento no se borro correctamente!\n" + error);
			});
	}
	setDetDoc(dueño, titulo, materia) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var timestamp;
		bd.collection("Listas")
			.where("dueño", "==", dueño)
			.where("nombreDoc", "==", titulo)
			.where("materia", "==", materia)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					if (doc.exists) {
						if (doc.data().color === "color") {
							document.getElementById("color").checked = true;
						} else {
							document.getElementById("bn").checked = true;
						}
						if (doc.data().tamañoHoja === "carta") {
							document.getElementById("carta").checked = true;
						} else if (doc.data().tamañoHoja === "oficio") {
							document.getElementById("oficio").checked = true;
						} else {
							document.getElementById("a4").checked = true;
						}
						if (doc.data().impresion === "intercalado") {
							document.getElementById("intercalado").checked = true;
						} else {
							document.getElementById("anv/rev").checked = true;
						}
						if (doc.data().acabado === "normal") {
							document.getElementById("normal").checked = true;
						} else {
							document.getElementById("engrampado").checked = true;
						}
						if (doc.data().tipoHoja === "normal") {
							document.getElementById("hojaNormal").checked = true;
						} else {
							document.getElementById("hojaReutilizada").checked = true;
						}
						document.getElementById("paginas").value = doc.data().numHojas;
						document.getElementById("dueño").innerHTML = `<span class="font-weight-bold">Nombre:  </span>` + doc.data().dueño;
						timestamp = new Date(doc.data().fecha.toDate());
						var fecha = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
						var hora = timestamp.getHours() + ":" + timestamp.getMinutes();
						document.getElementById("fecha").innerHTML = `<span class="font-weight-bold">Fecha de Recepcion:  </span>` + fecha;
						document.getElementById("hora").innerHTML = `<span class="font-weight-bold">Hora de Recepcion:  </span>` + hora;
					} else {
						alert("Documento no encontrado!");
					}
				});
			})
			.catch(function(error) {
				alert("Documento no se borro correctamente!\n" + error);
			});
	}
	GuardarCambiosArchivo(negocioID) {
		//console.log("click");
		var nhojas, prec;
		nhojas = document.getElementById("numHojas").value;
		prec = document.getElementById("precio").value;
		var auxNumHojas, auxPrecio;
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		console.log("userid : " + userid);
		var docRef = bd
			.collection("Listas")
			.where("negocioID", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					auxNumHojas = doc.data().numHojas;
					auxPrecio = doc.data().precio;
					if (auxNumHojas === nhojas && auxPrecio === prec) {
						console.log("los datos son lso mismos en admin");
					} else {
						//console.log("son distintos");
						actualizarDatosArchivo(negocioID);
						console.log("Se guardo cambios");
					}
				});
			})
			.catch(function(error) {
				console.log("Error al obtener los datos:", error);
			});
	}

	GuardarCambiosFormulario(negocioID) {
		//console.log("click");
		var duenio, materia, titulo;
		duenio = document.getElementById("dueño").value;
		materia = document.getElementById("materia").value;
		titulo = document.getElementById("tituloDoc").value;
		var auxDuenio, auxMateria, auxTitulo;
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		console.log("userid : " + userid);
		var docRef = bd
			.collection("Listas")
			.where("negocioID", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					auxDuenio = doc.data().dueño;
					auxMateria = doc.data().materia;
					auxTitulo = doc.data().nombreDoc;
					if (auxDuenio === duenio && auxMateria === materia && auxTitulo === titulo) {
						console.log("los datos son lso mismos en admin");
					} else {
						//console.log("son distintos");
						actualizarDatosFormulario(negocioID);
						console.log("Se guardo cambios");
					}
				});
			})
			.catch(function(error) {
				console.log("Error al obtener los datos:", error);
			});
	}
	GuardarCambiosDetallesRB(negocioID) {
		var duenio, materia, titulo;
		duenio = document.getElementById("dueño").value;
		materia = document.getElementById("materia").value;
		titulo = document.getElementById("tituloDoc").value;
		var auxDuenio, auxMateria, auxTitulo;
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		console.log("userid : " + negocioID);
		bd.collection("Listas")
			.where("negocioID", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					auxDuenio = doc.data().dueño;
					auxMateria = doc.data().materia;
					auxTitulo = doc.data().nombreDoc;
					//console.log("son distintos");
					actualizarDatosDetallesRB(negocioID);
					console.log("Se guardo cambios");
				});
			})
			.catch(function(error) {
				console.log("Error al obtener los datos:", error);
			});
	}

	nuevoDocEmp(negocioID, dueño, timestamp, materia, titulo, nroHojas, precio, acabado, tipoHoja, impresion, tamaño, color) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		bd.collection("Listas")
			.add({
				dueño: dueño,
				estado: "disponible",
				fecha: timestamp,
				materia: materia,
				precio: precio,
				negocioID: negocioID,
				color: color,
				impresion: impresion,
				acabado: acabado,
				numHojas: nroHojas,
				tamañoHoja: tamaño,
				tipoHoja: tipoHoja,
				nombreDoc: titulo
			})
			.then(function() {
				alert("Añadido a Lista!");
				location.href = "/html/empleadoUI/publicacionesNeg/pubLista.html";
			})
			.catch(function(error) {
				console.error("Error creando venta: ", error);
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
function actualizarDatosArchivo(negocioID) {
	//console.log("entro a cambiar datos de negocio");
	var nroHojas, precio, duenio, titulo, materia;
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var userid = user.uid;
	nroHojas = document.getElementById("numHojas").value;
	precio = document.getElementById("precio").value;
	duenio = document.getElementById("dueño").value;
	titulo = document.getElementById("tituloDoc").value;
	materia = document.getElementById("materia").value;
	if (
		//verifica que no esten vacios los campos
		nroHojas !== "" &&
		precio !== ""
	) {
		//console.log("no estan vacios");
		bd.collection("Listas")
			.where("negocioID", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					var listaId = doc.id;
					var auxDuenio = doc.data().dueño;
					var auxTitulo = doc.data().nombreDoc;
					var auxMateria = doc.data().materia;
					if (duenio === auxDuenio && titulo === auxTitulo && materia === auxMateria) {
						console.log("duenio : " + duenio);
						var docref2 = bd
							.collection("Listas")
							.doc(listaId)
							.update({
								precio: precio,
								numHojas: nroHojas
							})
							.then(e => {
								console.log("Datos Guardados Exitosamente de administrador");
							})
							.catch(e => {
								alert(`Error Guardando Datos: ${error}`);
							});
					}
				});
			});
	}
}
function actualizarDatosFormulario(negocioID) {
	//console.log("entro a cambiar datos de negocio");
	var duenio, materia, titulo;
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var userid = user.uid;
	duenio = document.getElementById("dueño").value;
	materia = document.getElementById("materia").value;
	titulo = document.getElementById("tituloDoc").value;
	if (
		//verifica que no esten vacios los campos
		duenio !== "" &&
		materia !== "" &&
		titulo !== ""
	) {
		bd.collection("Listas")
			.where("negocioID", "==", negocioID)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					var listaId = doc.id;
					var auxDuenio = doc.data().dueño;
					var auxTitulo = doc.data().nombreDoc;
					var auxMateria = doc.data().materia;
					console.log("duenio : " + duenio);
					var docref2 = bd
						.collection("Listas")
						.doc(listaId)
						.update({
							dueño: duenio,
							materia: materia,
							nombreDoc: titulo
						})
						.then(e => {
							console.log("Datos Guardados Exitosamente de administrador");
							location.reload();
						})
						.catch(e => {
							alert(`Error Guardando Datos: ${error}`);
						});
				});
			});
	}
}
async function actualizarDatosDetallesRB(negocioID) {
	var rbColor, rbLado, duenio, titulo, materia, rbEng, rbTipHojNor, rbTamCar, rbTamOfi, rbTamA4;
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var auxColor, auxLado, auxAcabado, auxTipHoj, auxTam;
	rbColor = document.getElementById("color").checked;
	rbLado = document.getElementById("intercalado").checked;
	rbEng = document.getElementById("engrampado").checked;
	rbTipHojNor = document.getElementById("hojaNormal").checked;
	duenio = document.getElementById("dueño").value;
	titulo = document.getElementById("tituloDoc").value;
	materia = document.getElementById("materia").value;
	rbTamCar = document.getElementById("carta").checked;
	rbTamOfi = document.getElementById("oficio").checked;
	rbTamA4 = document.getElementById("a4").checked;
	//console.log("no estan vacios");
	await bd
		.collection("Listas")
		.where("negocioID", "==", negocioID)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				var listaId = doc.id;
				var auxDuenio = doc.data().dueño;
				var auxTitulo = doc.data().nombreDoc;
				var auxMateria = doc.data().materia;
				if (duenio === auxDuenio && titulo === auxTitulo && materia == auxMateria) {
					if (rbColor === true) {
						auxColor = "color";
					} else {
						auxColor = "Blanco/Negro";
					}
					if (rbLado === true) {
						auxLado = "intercalado";
					} else {
						auxLado = "anv/rev";
					}
					if (rbEng === true) {
						auxAcabado = "engrampado";
					} else {
						auxAcabado = "normal";
					}
					if (rbTipHojNor === true) {
						auxTipHoj = "normal";
					} else {
						auxTipHoj = "reutilizado";
					}
					if (rbTamCar === true) {
						auxTam = "carta";
					}
					if (rbTamOfi === true) {
						auxTam = "oficio";
					}
					if (rbTamA4 === true) {
						auxTam = "a4";
					}
					console.log("duenio : " + duenio);
					var docref2 = bd
						.collection("Listas")
						.doc(listaId)
						.update({
							color: auxColor,
							impresion: auxLado,
							acabado: auxAcabado,
							tipoHoja: auxTipHoj,
							tamañoHoja: auxTam
						})
						.then(e => {
							console.log("Datos Guardados Exitosamente de administrador");
							location.reload();
						})
						.catch(e => {
							alert(`Error Guardando Datos: ${error}`);
						});
				}
			});
		});
}
