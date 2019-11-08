function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(function () {

    $(".base_info").submit(function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();

        var signature = $("#signature").val();
        var nick_name = $("#nick_name").val();
        // 获取用户选择的性别
        var gender = $(".gender:checked").val();

        if (!nick_name) {
            alert('请输入昵称');
            return
        }
        if (!gender) {
            alert('请选择性别');
        }

        // 组织参数
        var params = {
            "signature": signature,
            "nick_name": nick_name,
            "gender": gender
        };
        
        // TODO 请求修改用户基本信息
        $.ajax({
            url: "/user/user_base_info",
            type: "post",
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: {
                "X-CSRFToken": getCookie("csrf_token")
            },
            success: function (resp) {
                if (resp.errno == "0") {
                    // `设置`个人信息成功
                    // 更新父窗口内容
                    $('.user_center_name', parent.document).html(nick_name);
                    $('#nick_name', parent.document).html(nick_name);
                    $('.input_sub').blur()
                }
                else {
                    // `设置`个人信息失败
                    alert(resp.errmsg);
                }
            }
        })
    })
});