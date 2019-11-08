import json
import pandas as pd
from django import http
from django.core.paginator import Paginator
from django.forms import model_to_dict
from django.shortcuts import render
from django.views import View
from apps.index.models import New, Correlation
from django.db import DatabaseError
# Create your views here.
from apps.users.models import Collection, Comment


class IndexView(View):
    def get(self, request):
        if 'username' in request.COOKIES:
            username1 = request.COOKIES.get('username')
        else:
            username1 = None

        new = New.objects.all().order_by('-new_seenum')[: 8]
        return render(request, "index/index.html", {"username": username1, "rank_news": new})


class NewListView(View):
    """
    新闻列表
    """

    def get(self, request):
        # 获取参数
        page = request.GET.get("page")
        cid = int(request.GET.get("cid")) + 1  # 1.科技 2.汽车
        per_page = request.GET.get("per_page")
        # 数据库查询
        new_list = New.objects.filter(new_cate_id=cid).order_by("-id")
        # 创建分页对象
        paginator = Paginator(new_list, 10, 3)
        data = paginator.page(page)
        _data = [model_to_dict(x) for x in data]  # 构造字典
        print(cid, per_page, page, len(_data))

        ret = {
            "totalPage": paginator.num_pages + 1,
            "newsList": _data
        }

        return http.JsonResponse(ret)


class DetailView(View):
    def get(self, request, page):
        try:  # 流量监控
            new = New.objects.get(id=page)
            new.new_seenum += 1
            new.save()
        except DatabaseError:
            print("保存失败")

        if request.user.username:  # 关注相关
            username1 = request.user.username
            if request.user.id in [x.user_id_id for x in Collection.objects.filter(news_id_id=page)]:
                can_collect = False
            else:
                can_collect = True
        else:
            username1 = None
            can_collect = True

        new = New.objects.get(id=page)  # 新闻内容

        rank_news = New.objects.all().order_by('-new_seenum')[: 8]  # 热度数据

        kind_num = New.objects.get(id=page)
        next_new = New.objects.filter(id__lt=page, new_cate_id=kind_num.new_cate_id).all().order_by(
            "-id").first()  # 下一篇数据

        # 评论相关数据
        comment = Comment.objects.filter(new_info_id=page)

        # 推荐相关查询
        _temp = Correlation.objects.filter(new_id=str(page))  # x 推荐x
        _temp = pd.DataFrame([[int(x.like_new_id), float(x.similarity)] for x in _temp], columns=["x", "y"])
        _temp = _temp.sort_values("y", ascending=False)["x"].to_list()

        _result = [New.objects.get(id=x) for x in _temp]

        return render(request, "index/detail.html",
                      {"news": new, "username": username1, "can_collect": can_collect, "rank_news": rank_news,
                       "next_new": next_new, "comment": comment, "result": _result})
