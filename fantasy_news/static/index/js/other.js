// 解析url中的查询字符串
function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(function(){
    // 页面加载完毕，获取新闻列表
    getNewsList(1);

    // TODO 关注当前作者
    $(".focus").click(function () {

    });

    // TODO 取消关注当前作者
    $(".focused").click(function () {

    })
});

// TODO 获取新闻列表
function getNewsList(page) {
    // 获取作者id
    var user_id = $(".user_menu_con").attr("data-user-id");

    // $.get("/user/" + user_id + '/news?p=' + page, function (resp) {
    //
    // });

    $.ajax({
        url: "/user/" + user_id + '/news?p=' + page,
        type: "get",
        success: function (resp) {
            if (resp.errno == "0") {
                // 获取成功
                // 先清空原有的数据
                $(".article_list").html("");
                // 拼接数据
                var news_li = resp.news_li;
                for (var i = 0; i<news_li.length; i++) {
                    var news = news_li[i];
                    var html = '<li><a href="/news/'+ news.id +'" target="_blank">' + news.title + '</a><span>' + news.create_time + '</span></li>';
                    // 添加数据
                    $(".article_list").append(html);
                }

                // 设置页数和总页数
                $("#pagination").pagination("setPage", resp.current_page, resp.total_page);
                }
                else {
                    // 获取失败
                    alert(resp.errmsg);
                }
        }
    })
}
