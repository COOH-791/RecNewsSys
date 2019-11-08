function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(function(){
    $(".news_review").submit(function (e) {
        e.preventDefault();

        // 获取参数
        var action = $("input[name=action]:checked").val();

        var reason = '';
        if (action == 'reject') {
            // 获取拒绝原因
            reason = $("#reason").val();

            if (!reason) {
                alert('请输入拒绝原因!');
                return;
            }
        }

        var news_id = $("#news_id").val();

        var params = {
            'action': action,
            'reason': reason
        };

        // TODO 新闻审核提交
        $.ajax({
            url: "/admin/news_review_detail/" + news_id,
            type: "post",
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: {
                "X-CSRFToken": getCookie("csrf_token")
            },
            success: function (resp) {
                if (resp.errno == '0') {
                    // 审核通过
                    // 返回上一页，刷新数据
                    location.href = document.referrer
                }
                else {
                    // 审核失败
                    alert(resp.errmsg);
                }
            }
        })


    })
});

// 点击取消，返回上一页
function cancel() {
    history.go(-1);
}