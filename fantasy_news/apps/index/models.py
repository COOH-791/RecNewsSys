from django.db import models


# Create your models here.

# 新闻类别表


class Cate(models.Model):
    # cate_id = models.CharField(blank=False, max_length=64, verbose_name='ID', unique=True)
    cate_name = models.CharField(max_length=64, verbose_name='名字')

    def __str__(self):
        return self.cate_name

    class Meta:
        db_table = 'cate'
        verbose_name_plural = "新闻类别表"


# 新闻表
class New(models.Model):
    new_cate = models.ForeignKey(Cate, related_name="类别")  # 所属类别

    new_time = models.CharField(max_length=100, verbose_name="发布时间")
    new_seenum = models.IntegerField(verbose_name="浏览次数", default=0)
    new_disnum = models.IntegerField(verbose_name="跟帖次数", default=0)
    index_image_url = models.CharField(max_length=200, verbose_name="新闻列表图片路径", default='SOME STRING')
    # related_name定义主表对象查询子表时使用的方法名称
    new_title = models.CharField(blank=False, max_length=100, verbose_name="标题")
    new_source = models.TextField(verbose_name="新闻来源", max_length=20, blank=False, default="Fantasy News")
    digest = models.CharField(max_length=500, default='SOME STRING')  # 新闻摘要
    new_content = models.TextField(blank=False, verbose_name="新闻内容")

    def __str__(self):
        return self.new_title

    class Meta:
        db_table = 'new'
        verbose_name_plural = "新闻信息表"


class Correlation(models.Model):
    new_id = models.CharField(max_length=100, verbose_name="新闻id")
    like_new_id = models.CharField(max_length=100, verbose_name="相似新闻id")
    similarity = models.CharField(max_length=100, verbose_name="相似度")

    def __str__(self):
        return self.new_id

    class Meta:
        db_table = "new_correlation"
        verbose_name_plural = "新闻相似度表"
