class Venta {
	constructor(
		numFactura,
		fecha,
		nitCliente,
		apellido,
		docNomb,
		cantidad,
		monto,
		pedidoID,
		clienteID,
		color,
		docID,
		acabado,
		fechaPed,
		fechaPedEntrega,
		impresion,
		metodoPago,
		paginas,
		tamaño,
		tipo,
		tipoHoja
	) {
		this.numFactura = numFactura;
		this.fecha = fecha;
		this.nitCliente = nitCliente;
		this.apellido = apellido;
		this.docNomb = docNomb;
		this.cantidad = cantidad;
		this.monto = monto;
		this.pedidoID = pedidoID;
		this.clienteID = clienteID;
		this.color = color;
		this.docID = docID;
		this.acabado = acabado;
		this.fechaPed = fechaPed;
		this.fechaPedEntrega = fechaPedEntrega;
		this.metodoPago = metodoPago;
		this.paginas = paginas;
		this.tamaño = tamaño;
		this.tipoHoja = tipoHoja;
		this.tipo = tipo;
		this.impresion = impresion;
	}
	nuevaVenta(
		numFac,
		fecha,
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
	) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		bd.collection("Venta")
			.add({
				apellidoFactura: apellido,
				cantidad: cant,
				fecha: fecha,
				metodoPago: pago,
				monto: precio,
				nitCliente: nitCli,
				nombreDoc: docNomb,
				numFactura: numFac,
				negocioID: userid,
				clienteID: clienteID,
				BN: BN,
				docID: docID,
				acabado: acabado,
				fechaPed: fechaPed,
				fechaPedEntrega: fechaPedEntrega,
				ladosImpr: lados,
				numPaginas: paginas,
				tamañoHoja: tamaño,
				tipoHoja: tipoHoja,
				tipoDoc: tipo
			})
			.then(function() {
				bd.collection("Pedido")
					.doc(pedidoID)
					.delete()
					.then(function() {
						console.log("Documento eliminado exitosamente!");
					})
					.catch(function(error) {
						console.error("Error eliminando documento: ", error);
					});
				console.log("Venta creada exitosamente!");
				location.reload();
			})
			.catch(function(error) {
				console.error("Error creando venta: ", error);
			});
	}
	//Setea los detalles de la venta.
	async setPedDet(nit, numFac, fecha, hora) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var fechaP, horaP, usuario;
		var f = fecha.split("/");
		var d = f[0];
		var m = f[1];
		var a = f[2];
		var timestamp = new Date(a + "-" + m + "-" + d + " " + hora);
		var numFac = parseInt(numFac);
		var query = bd
			.collection("Venta")
			.where("nitCliente", "==", nit)
			.where("negocioID", "==", user.uid)
			.where("numFactura", "==", numFac);
		query
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(async function(doc) {
					await bd
						.collection("Clientes")
						.doc(doc.data().clienteID)
						.get()
						.then(function(docu) {
							usuario = docu.data().Nombre;
						});
					document.getElementById("nombreDocD").innerHTML = doc.data().nombreDoc;
					if (doc.data().BN === false) {
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
					if (doc.data().ladosImpr === "intercalado") {
						document.getElementById("impresionD").value = "intercalado";
					} else {
						document.getElementById("impresionD").value = "anv/rev";
					}
					document.getElementById("numPagD").value = doc.data().numPaginas;
					if (doc.data().acabado === "engrampado") {
						document.getElementById("acabadoD").value = "Si";
					} else {
						document.getElementById("acabadoD").value = "No";
					}
					if (doc.data().tipoHoja === "normal") {
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
					timestamp = new Date(doc.data().fechaPed.toDate());
					fechaP = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
					horaP = timestamp.getHours() + ":" + timestamp.getMinutes();
					document.getElementById("fechaD").value = fechaP;
					document.getElementById("horaD").value = horaP;
					document.getElementById("fEntregaD").value = fecha;
					document.getElementById("hEntregaD").value = hora;
					document.getElementById("costoD").value = doc.data().monto;
				});
			})
			.catch(function(error) {
				console.error("No se obtubo los datos del documento correctamente!\n" + error);
			});
	}
}
