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
		var userid = user.uid;
		bd.collection("Listas")
			.where("negocioID", "==", userid)
			.where("dueño", "==", dueño)
			.where("nombreDoc", "==", titulo)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					if (doc.exists) {
						console.log("positive");
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
						document.getElementById("numero").innerHTML = doc.data().numHojas;
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
}
