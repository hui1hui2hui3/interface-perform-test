$(function() {
    $(".js-run-jmeter").click(function() {
        var filename = $(this).attr("data-url");
        $(this).prop('disabled', true);
        var $btn = $(this).button('loading')
        $.ajax({
            method: "get",
            url: "/runJmeter/" + filename
        }).done(function(args) {
            $(".js-test-result[data-url="+filename+"]").html(args);
            $(".js-download[data-url="+filename+"]").removeClass("disabled");
        }).fail(function(args) {
            $(".js-test-result[data-url="+filename+"]").html(args);
        }).always(function() {
            $btn.button('reset');
            $(this).prop('disabled', true);
        })
    })
})
