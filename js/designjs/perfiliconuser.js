//llama a perfil de usuario
$('.icon-user').on('click',function(e){
    e.preventDefault();
    $('#perfiliconusuario').modal('show').find('.modal-content').load($(this).attr('href'));
});
//--llama a perfil de usuario
//llama a perfil de administrador
$('.icon-user').on('click',function(e){
    e.preventDefault();
    $('#perfiliconadmi').modal('show').find('.modal-content').load($(this).attr('href'));
});
//--llama a perfil de administrador
//llama a perfil de empleado
$('.icon-user').on('click',function(e){
    e.preventDefault();
    $('#perfiliconemp').modal('show').find('.modal-content').load($(this).attr('href'));
});
//--llama a perfil de empleado