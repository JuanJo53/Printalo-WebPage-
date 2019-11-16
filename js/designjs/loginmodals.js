$('.modal-neg').on('click',function(e){
    e.preventDefault();
    $('#modalNegocio').modal('show').find('.modal-dialog').load($(this).attr('href'));
});