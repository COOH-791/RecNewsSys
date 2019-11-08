function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}


$(function () {
    $(".logout").click(function () {
        // 退出请求
        $.ajax({
            url: "/admin/logout",
            type: "post",
            headers: {
                "X-CSRFToken": getCookie("csrf_token")
            },
            success: function (resp) {
                if (resp.errno == "0") {
                    // 退出成功
                    location.href = '/admin/login';
                }
                else {
                    alert(resp.errmsg);
                }
            }
        })
    })
});
