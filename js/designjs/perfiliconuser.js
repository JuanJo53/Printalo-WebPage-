$('.icon-user').on('click',function(e){
    e.preventDefault();
    $('#perfiliconusuario').modal('show').find('.modal-content').load($(this).attr('href'));
});