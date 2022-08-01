
$(function(){
    if($('textarea#ta').length) {
    CKEDITOR.replace('content')
    }

    $('a.confirmDelete').click((event)=>{
        if(!confirm("Confirm Delete ???")){
            return false
        }
    })

    // Thumbs image
    if($("[data-fancybox]").length) {
        $("[data-fancybox]").fancybox()
    }

    // CLear Cart
    $('a.clearCart').click((event)=>{
        if(!confirm("Confirm Clear Cart ???")){
            return false
        }
    })

})