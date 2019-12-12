class Pedido {
	//Borra el pedido seleccionado.
	eliminarPedido(_this) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var storage = firebase.storage();
		var storageRef = storage.ref();
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
						document.getElementById("tipoHojaD").value = "Hoja Normal";
					}
					document.getElementById("cantD").value = doc.data().cantidad;
					if (doc.data().metodoPago === "personal") {
						document.getElementById("pagoD").value = "Personal";
					} else {
						document.getElementById("pagoD").value = "Tarjeta de Credito";
					}
					document.getElementById("clienteD").value = usuario;
					timestamp = new Date(doc.data().fecha.toDate());
					fecha =
						timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
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
							var docRef = storage.ref(
								"docsPedidos/" + doc.data().clienteID + "/" + doc.data().nombreDoc
							);
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
}
