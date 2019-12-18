class Lista {
	constructor(dueño, timestamp, materia, titulo, nroHojas, precio, acabado, tipoHoja, impresion, tamaño, color) {
		this.dueño = dueño;
		this.timestamp = timestamp;
		this.materia = materia;
		this.titulo = titulo;
		this.nroHojas = nroHojas;
		this.precio = precio;
		this.acabado = acabado;
		this.tipoHoja = tipoHoja;
		this.impresion = impresion;
		this.tamaño = tamaño;
		this.color = color;
	}
	nuevoDoc() {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		bd.collection("Listas")
			.add({
				dueño: this.dueño,
				estado: "disponible",
				fecha: this.timestamp,
				materia: this.materia,
				precio: this.precio,
				negocioID: userid,
				color: this.color,
				impresion: this.impresion,
				acabado: this.acabado,
				numHojas: this.nroHojas,
				tamañoHoja: this.tamaño,
				tipoHoja: this.tipoHoja,
				nombreDoc: this.titulo
			})
			.then(function() {
				alert("Añadido a Lista!");
				location.href = "/html/negocioUI/publicacionesNeg/pubLista.html";
			})
			.catch(function(error) {
				console.error("Error creando venta: ", error);
			});
	}
	eliminarDoc(dueño, titulo) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		var userid = user.uid;
		bd.collection("Listas")
			.where("negocioID", "==", userid)
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
	editarDoc(dueño, titulo) {
		var user = firebase.auth().currentUser;
		var bd = firebase.firestore();
		bd.collection("Listas")
			.where("negocioID", "==", userid)
			.where("dueño", "==", dueño)
			.where("nombreDoc", "==", titulo)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					if (doc.exists) {
					} else {
						alert("Documento no encontrado!");
					}
				});
			})
			.catch(function(error) {
				alert("Documento no se borro correctamente!\n" + error);
			});
	}
}
