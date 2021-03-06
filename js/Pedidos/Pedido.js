class Pedido {
	constructor(
		color,
		neg,
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
		costoTotal,
		negocioID,
		docID
	) {
		this.color = color;
		this.neg = neg;
		this.tamanio = tamanio;
		this.impresion = impresion;
		this.numPag = numPag;
		this.paginas = paginas;
		this.acabado = acabado;
		this.tipo = tipo;
		this.cantidad = cantidad;
		this.timestamp = timestamp;
		this.numTarjeta = numTarjeta;
		this.nombTarjeta = nombTarjeta;
		this.pago = pago;
		this.mes = mes;
		this.anio = anio;
		this.costoTotal = costoTotal;
		this.docID = docID;
		this.negocioID = negocioID;
	}
	nuevoPedido(
		color,
		neg,
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
	) {
		var bd = firebase.firestore();
		var user = firebase.auth().currentUser;
		var neg;
		var negQuery = bd.collection("Negocios").where("nombreNeg", "==", neg);
		negQuery
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					negocioID = doc.id;
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
										negocioID: negocioID,
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
	//Borra el pedido seleccionado.
	eliminarPedido(_this) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var storage = firebase.storage();
		var storageRef = storage.ref();
		var nomb = getRowSelected(_this);
		console.log(nomb);

		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", nomb)
			.where("clienteID", "==", user.uid);
		query
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					doc.ref.delete();
					console.log("Documento se borro correctamente");
					var docRef = storageRef.child("docsPedidos/" + user.uid + "/" + nomb);
					docRef
						.delete()
						.then(function() {
							alert("El documento se borro exitosamente!");
							location.reload();
						})
						.catch(function(error) {
							alert("Hubo un error en borrar el documento!");
						});
				});
			})
			.catch(function(error) {
				console.log("Documento no se borro correctamente");
			});
	}
	//Cancela el pedido seleccionado que ya se envio.
	cancelarPedido(_this) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var nomb = getRowSelected(_this);
		console.log(nomb);
		var user = firebase.auth().currentUser;

		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", nomb)
			.where("clienteID", "==", user.uid);
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
						});
				});
			})
			.catch(function(error) {
				console.log("Documento no se borro co(rrectamente");
			});
	}
	//Rechazar pedido entrante.
	rechazarPedido(doc, precio, cant, pago, fecha, hora) {
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
			.where("negocioID", "==", user.uid)
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
	//Setea los detalles del pedido para visualizacion antes de aceptarlo.
	setPedDet(docN, usuario, precio, cant, pago, fechaE, horaE) {
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
			.where("negocioID", "==", user.uid)
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
	aceptarPedido() {
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
			.where("negocioID", "==", user.uid)
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
	realizarPedido(docN, fechaE, horaE) {
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
			.where("negocioID", "==", user.uid)
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
	imprPedido() {
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
		console.log(timestamp);
		var storage = firebase.storage();

		var query = bd
			.collection("Pedido")
			.where("nombreDoc", "==", docN)
			.where("negocioID", "==", user.uid)
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

	async setDatFactura(nitCli, apellido, docNomb, precio, literal, cant, pago, fechaE, horaE) {
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
			.doc(userid)
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
			.where("negocioID", "==", userid)
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
	nuevaFot(
		color,
		negocioID,
		tamanio,
		impresion,
		numPag,
		paginas,
		acabado,
		tipo,
		cantidad,
		timestampEntrega,
		titulo,
		materia,
		dueño,
		pago,
		precio
	) {
		var bd = firebase.firestore();
		var user = firebase.auth().currentUser;
		var timestamp = firebase.firestore.Timestamp.now().toDate();
		bd.collection("Pedido")
			.add({
				clienteID: user.uid,
				blancoYnegro: color,
				cantidad: cantidad,
				costoTotal: precio,
				engrampado: acabado,
				estado: "solicitado",
				fecha: timestamp,
				fechaEntrega: timestampEntrega,
				ladosImpre: impresion,
				metodoPago: pago,
				negocioID: negocioID,
				numPaginas: numPag,
				paginas: paginas,
				tamañoHoja: tamanio,
				tipoHoja: tipo,
				materia: materia,
				dueño: dueño,
				nombreDoc: titulo
			})
			.then(function(docRef) {
				alert("Pedido Solicitado!");
				console.log(docRef.id);
			})
			.catch(function(error) {
				alert("Hubo un error y su perdido no se realizo! ", error);
			});
	}
}
