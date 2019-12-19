window.onload = ValidarNeg();

var btnLista = document.getElementById("listas");
btnLista.addEventListener("click", function() {
	var title = document.getElementById("titleInfo").innerHTML;
	var sp = title.split(" ");
	var negocioID = sp[2];
	console.log(negocioID);
	window.location = "./listasPuesto.html?negocio=" + negocioID;
});

async function getDocsData() {
	var user = firebase.auth().currentUser;
	var bd = firebase.firestore();
	var dir, telef, email;
	var entLunes,salLunes;
	var entMartes,salMartes;
	var entMiercoles,salMiercoles;
	var entJueves,salJueves;
	var entViernes,salViernes;
	var entSabado,salSabado;
	var negocioID;
	await bd
		.collection("Negocios")
		.where("nombreNeg", "==", nombre)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				negocioID = doc.id;
				dir = doc.data().dir;
				telef = doc.data().fono;
				email = doc.data().email;
				entLunes=doc.data().horario.lunes.horaEntrada;
				salLunes=doc.data().horario.lunes.horaSalida;
				entMartes=doc.data().horario.martes.horaEntrada;
				salMartes=doc.data().horario.martes.horaSalida;
				entMiercoles=doc.data().horario.miercoles.horaEntrada;
				salMiercoles=doc.data().horario.miercoles.horaSalida;
				entJueves=doc.data().horario.jueves.horaEntrada;
				salJueves=doc.data().horario.jueves.horaSalida;
				entViernes=doc.data().horario.viernes.horaEntrada;
				salViernes=doc.data().horario.viernes.horaSalida;
				entSabado=doc.data().horario.sabado.horaEntrada;
				salSabado=doc.data().horario.sabado.horaSalida;
			});
		});
	console.log(negocioID);
	setData(dir, telef, email,entLunes,salLunes,entMartes,salMartes,entMiercoles,salMiercoles,entJueves,salJueves,entViernes,salViernes,entSabado,salSabado);
}

function setData(dir, telef, email,entLunes,salLunes,entMartes,salMartes,entMiercoles,salMiercoles,entJueves,salJueves,entViernes,salViernes,entSabado,salSabado) {
	document.getElementById("direccion").innerHTML = `<span class="font-weight-bold">Calle : </span>` + dir;
	document.getElementById("telefono").innerHTML = `<span class="font-weight-bold">Telefono : </span>` + telef;
	document.getElementById("correo").innerHTML = `<span class="font-weight-bold">E-mail : </span>` + email;
	document.getElementById("lunes").innerHTML = `<div class="input-group-prepend box">
	<!--dia-->
	<span class="input-group-text dia">Lunes</span>
	<!--//dia-->
	<!--horarios entreda-salida-->
	<div class="input-group ">
		<!--Input entrada-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+entLunes+`" id="lunesEntrada" disabled>
		<!--//Input entrada-->
		<!--divisor-->
		<div class="input-group-append ">
			<!--Detalle - -->
			<span
				class="input-group-text bg-printalo-blueDetail bcero">-</span>
			<!--Detalle - -->
		</div>
		<!--//divisor-->
		<!--Input salida-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+salLunes+`" id="lunesSalida" disabled>
		<!--Input salida-->
	</div>
	<!--//horarios entreda-salida-->
	</div>`;
	document.getElementById("martes").innerHTML = `<div class="input-group-prepend box">
	<!--dia-->
	<span class="input-group-text dia">Martes</span>
	<!--//dia-->
	<!--horarios entreda-salida-->
	<div class="input-group ">
		<!--Input entrada-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+entMartes+`" id="lunesEntrada" disabled>
		<!--//Input entrada-->
		<!--divisor-->
		<div class="input-group-append ">
			<!--Detalle - -->
			<span
				class="input-group-text bg-printalo-blueDetail bcero">-</span>
			<!--Detalle - -->
		</div>
		<!--//divisor-->
		<!--Input salida-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+salMartes+`" id="lunesSalida" disabled>
		<!--Input salida-->
	</div>
	<!--//horarios entreda-salida-->
	</div>`;
	document.getElementById("miercoles").innerHTML = `<div class="input-group-prepend box">
	<!--dia-->
	<span class="input-group-text dia">Miercoles</span>
	<!--//dia-->
	<!--horarios entreda-salida-->
	<div class="input-group ">
		<!--Input entrada-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+entMiercoles+`" id="lunesEntrada" disabled>
		<!--//Input entrada-->
		<!--divisor-->
		<div class="input-group-append ">
			<!--Detalle - -->
			<span
				class="input-group-text bg-printalo-blueDetail bcero">-</span>
			<!--Detalle - -->
		</div>
		<!--//divisor-->
		<!--Input salida-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+salMiercoles+`" id="lunesSalida" disabled>
		<!--Input salida-->
	</div>
	<!--//horarios entreda-salida-->
	</div>`;
	document.getElementById("jueves").innerHTML = `<div class="input-group-prepend box">
	<!--dia-->
	<span class="input-group-text dia">Jueves</span>
	<!--//dia-->
	<!--horarios entreda-salida-->
	<div class="input-group ">
		<!--Input entrada-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+entJueves+`" id="lunesEntrada" disabled>
		<!--//Input entrada-->
		<!--divisor-->
		<div class="input-group-append ">
			<!--Detalle - -->
			<span
				class="input-group-text bg-printalo-blueDetail bcero">-</span>
			<!--Detalle - -->
		</div>
		<!--//divisor-->
		<!--Input salida-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+salJueves+`" id="lunesSalida" disabled>
		<!--Input salida-->
	</div>
	<!--//horarios entreda-salida-->
	</div>`;
	document.getElementById("viernes").innerHTML = `<div class="input-group-prepend box">
	<!--dia-->
	<span class="input-group-text dia">Viernes</span>
	<!--//dia-->
	<!--horarios entreda-salida-->
	<div class="input-group ">
		<!--Input entrada-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+entViernes+`" id="lunesEntrada" disabled>
		<!--//Input entrada-->
		<!--divisor-->
		<div class="input-group-append ">
			<!--Detalle - -->
			<span
				class="input-group-text bg-printalo-blueDetail bcero">-</span>
			<!--Detalle - -->
		</div>
		<!--//divisor-->
		<!--Input salida-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+salViernes+`" id="lunesSalida" disabled>
		<!--Input salida-->
	</div>
	<!--//horarios entreda-salida-->
	</div>`;
	document.getElementById("sabado").innerHTML = `<div class="input-group-prepend box">
	<!--dia-->
	<span class="input-group-text dia">Sabado</span>
	<!--//dia-->
	<!--horarios entreda-salida-->
	<div class="input-group ">
		<!--Input entrada-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+entSabado+`" id="lunesEntrada" disabled>
		<!--//Input entrada-->
		<!--divisor-->
		<div class="input-group-append ">
			<!--Detalle - -->
			<span
				class="input-group-text bg-printalo-blueDetail bcero">-</span>
			<!--Detalle - -->
		</div>
		<!--//divisor-->
		<!--Input salida-->
		<input type="text" class="form-control text-center clock"
			placeholder="`+salSabado+`" id="lunesSalida" disabled>
		<!--Input salida-->
	</div>
	<!--//horarios entreda-salida-->
	</div>`;
}
var nombre;
function getNeg() {
	var ref = window.location.search;
	var neg = ref.split("=");
	nombre = neg[1];
	document.getElementById("titleInfo").innerHTML = "Informacion de " + nombre;
}
// Esta funcion ejecuta el observador de firebase
function ValidarNeg() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			getNeg();
			getDocsData();
			console.log("Logeado");
		} else {
			// User is not signed in.
			console.log("No Logeado");
			location.href = "/html/index/usuarioIndex/indexUser.html";
		}
	});
}
