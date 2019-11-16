$('.modal-neg').on('click',function(e){
    e.preventDefault();
    $('#modalNegocio').modal('show').find('.modal-dialog').load($(this).attr('href'));
});

$('.modal-register-neg').on('click',function(e){
    e.preventDefault();
    $('#modalRegisterNegocio').modal('show').find('.modal-dialog').load($(this).attr('href'));
});