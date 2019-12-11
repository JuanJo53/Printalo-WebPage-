window.onload = ValidarCli();
//Esta funcion obtiene los datos del pedido de la base de datos.
function getDocData() {
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  bd.collection('Pedido')
    .where('clienteID', '==', user.uid)
    .where('estado', '==', 'realizado')
    .orderBy('fecha')
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        setData(doc.data().tipoDoc, doc.data().nombreDoc);
      });
    })
    .catch(function(error) {
      console.log('Error obteniendo los documentos: ', error);
    });
}
//Setea los datos de los pedidos en la tabla respectiva.
function setData(doc, nomb, prec, cant, pag, f, h) {
  var table = document.getElementsByTagName('table')[0];
  var newRow = table.insertRow(1);

  var nro = newRow.insertCell(0);
  var nombUser = newRow.insertCell(1);
  var precio = newRow.insertCell(2);
  var cantidad = newRow.insertCell(3);
  var pago = newRow.insertCell(4);
  var fecha = newRow.insertCell(5);
  var hora = newRow.insertCell(6);
  var detalles = newRow.insertCell(7);
  var rechazar = newRow.insertCell(8);

  nro.className = 'text-center';
  nombUser.className = 'text-center';
  precio.className = 'text-center';
  cantidad.className = 'text-center';
  pago.className = 'text-center';
  fecha.className = 'text-center';
  hora.className = 'text-center';
  detalles.className = 'text-center';
  rechazar.className = 'text-center';

  $(document).ready(function() {
    var t = $('#example').DataTable();
    t.row
      .add([
        doc,
        nomb,
        prec,
        cant,
        pag,
        f,
        h,
        `<div class="color-printalo-greenDetail"><i
        class="far fa-check-square fa-2x"></i></div>`,
        `<button href="" class="btn bg-printalo-greenDetail positive" data-dismiss="modal"
        data-target="#modalVerDetalles" data-toggle="modal">Detalles</button>`,
        `<button href="" class="btn bg-printalo-greenDetail positive" data-dismiss="modal"
        data-target="#entregarPedido" data-toggle="modal">Entregar</button>`
      ])
      .draw(false);
  });
}
//Obtiene los detalles del documento seleccionado en los pedidos enviados.
function getDocDet(_this) {
  var user = firebase.auth().currentUser;
  var bd = firebase.firestore();
  var docNomb = getRowSelected(_this);
  var timestamp, fecha, hora;
  bd.collection('Pedido')
    .where('clienteID', '==', user.uid)
    .where('estado', '==', 'realizado')
    .where('nombreDoc', '==', docNomb)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (doc.data().blancoYnegro === false) {
          document.getElementById('colorP').checked = true;
        } else {
          document.getElementById('BNP').checked = true;
        }
        if (doc.data().tamañoHoja === 'carta') {
          document.getElementById('cartaP').checked = true;
        } else if (doc.data().tamañoHoja === 'oficio') {
          document.getElementById('oficioP').checked = true;
        } else {
          document.getElementById('a4P').checked = true;
        }
        if (doc.data().ladosImpre === 'intercalado') {
          document.getElementById('intercaladoP').checked = true;
        } else {
          document.getElementById('anvP').checked = true;
        }
        document.getElementById('paginas').value = doc.data().numPaginas;
        if (doc.data().engrampado === 'normal') {
          document.getElementById('normalP').checked = true;
        } else {
          document.getElementById('engrampadoP').checked = true;
        }
        if (doc.data().tipo === 'normal') {
          document.getElementById('TnormalP').checked = true;
        } else {
          document.getElementById('TreutilizadoP').checked = true;
        }
        document.getElementById('cantidadP').value = doc.data().cantidad;
        if (doc.data().metodoPago === 'personal') {
          document.getElementById('personalP').checked = true;
        } else {
          document.getElementById('tarjetaP').checked = true;
        }
        timestamp = new Date(doc.data().fechaEntrega.toDate());
        fecha =
          timestamp.getDate() +
          '/' +
          (timestamp.getMonth() + 1) +
          '/' +
          timestamp.getFullYear();
        hora = timestamp.getHours() + ':' + timestamp.getMinutes();
        document.getElementById('fechaP').value = fecha;
        document.getElementById('horaP').value = hora;
        document.getElementById('costo').value = doc.data().costoTotal;
      });
    });
}
//Obtiene el nombre de la fila seleccionada.
function getRowSelected(objectPressed) {
  var a = objectPressed.parentNode.parentNode;
  var nomb = a.getElementsByTagName('td')[1].innerHTML;
  return nomb;
}
//Esta funcion ejecuta el observador de firebase
function ValidarCli() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      getDocData();
      console.log('Logeado');
    } else {
      // User is not signed in.
      console.log('No Logeado');
      location.href = '/html/index/usuarioIndex/indexUser.html';
    }
  });
}
