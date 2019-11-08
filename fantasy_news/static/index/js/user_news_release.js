function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}


$(function () {

    $(".release_form").submit(function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();

        // TODO 发布完毕之后需要选中我的发布新闻
        $(this).ajaxSubmit({
            beforeSubmit: function (request) {
                // 在提交之前，对参数进行处理
                for(var i=0; i<request.length; i++) {
                    var item = request[i];
                    if (item["name"] == "content") {
                        item["value"] = tinyMCE.activeEditor.getContent();
                    }
                }
            },
            url: '/user/user_news_release',
            type: 'post',
            headers: {
                'X-CSRFToken': getCookie('csrf_token')
            },
            success: function (resp) {
                if (resp.errno == '0') {
                    // 新闻`发布`成功
                    // 选中索引为6的左边单菜单
                    window.parent.fnChangeMenu(6);
                    // 滚动到顶部
                    window.parent.scrollTo(0, 0);
                }
                else {
                    // `新闻发布`失败
                    $('.error_tip2').html(resp.errmsg).show();
                }
            }

        });
    })
});