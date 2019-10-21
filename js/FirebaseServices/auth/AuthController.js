$(() => {    

    //$("#authFB").click(() => );

    $("#registrarseModal").click(() => {
        const nombres = $('#username').val();
        const email = $('#name').val();
        const password = $('#password').val();
        const auth = new Autenticacion()
        auth.crearCuentaEmailPass(email,password,nombres)
        // TODO : LLamar crear cuenta con email
    });

    $("#btnInicioEmail").click(() => {
        const email = $('#emailSesion').val();
        const password = $('#passwordSesion').val();
        // TODO : LLamar auth cuenta con email
    });

    //$("#authGoogle").click(() => //AUTH con GOOGLE);

    //$("#authTwitter").click(() => //AUTH con Twitter);

    $('#btnRegistrarse').click(() => {
        $('#modalSesion').modal('close');
        $('#modalRegistro').modal('open');
    });

    $('#btnIniciarSesion').click(() => {
        $('#modalRegistro').modal('close');
        $('#modalSesion').modal('open');
    });

});