$(function() {
    $(".js-run-jmeter").click(function() {
        var filename = $(this).attr("data-url");
        $(this).prop('disabled', true);
        var $btn = $(this).button('loading')
        $.ajax({
            method: "get",
            url: "/runJmeter/" + filename
        }).done(function(args) {
            $(".js-test-result[data-url=" + filename + "]").html(args.testResult);
            var downloadBtn = $(".js-download[data-url=" + filename + "]");
            downloadBtn.attr("href", "/download/" + args.logName)
            downloadBtn.removeClass("disabled");
        }).fail(function(args) {
            $(".js-test-result[data-url=" + filename + "]").html(args.testResult);
        }).always(function() {
            $btn.button('reset');
            $(this).prop('disabled', true);
        })
    })
})
