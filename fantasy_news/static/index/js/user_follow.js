function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}


$(function () {

  $(".focused").click(function () {
        // 获取参数
        var user_id = $(this).attr("data-user-id");
        var action = "undo";

        // 组织参数
        var params = {
            "user_id": user_id,
            "action": action
        };

        // TODO 取消关注当前用户
        $.ajax({
            url: "/user/follow",
            type: "post",
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: {
                "X-CSRFToken": getCookie("csrf_token")
            },
            success: function (resp) {
                if (resp.errno == "0") {
                    // `取消关注`成功
                    // 刷新当前页面
                    location.reload();
                }
                else {
                    // `取消关注`成功
                    alert(resp.errmsg);
                }
            }
        })
    })
});