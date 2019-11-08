from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from apps.index.models import New


class User(AbstractUser):
    """自定义用户模型类"""
    CHOICE = (
        ('1', '男'),
        ('2', '女')
    )
    mobile = models.CharField(max_length=11, unique=True, verbose_name='手机号')
    signature = models.CharField(max_length=100, default="要小心碌碌庸庸带来的空虚", null=True)
    gender = models.CharField(max_length=4, choices=CHOICE, null=True)

    class Meta:
        db_table = 'tb_users'
        verbose_name = '用户'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.username


class Collection(models.Model):
    user_id = models.ForeignKey(User, related_name="用户id")
    news_id = models.ForeignKey(New, related_name="新闻id")
    create_time = models.DateTimeField("日期", default=timezone.now)

    def __str__(self):
        return self.user_id

    class Meta:
        db_table = 'collection'  # 收藏新闻
        verbose_name_plural = "收藏"


class Comment(models.Model):
    user_info = models.ForeignKey(User, related_name="评论用户id")
    new_info = models.ForeignKey(New, related_name="被评论新闻id")
    content = models.CharField(max_length=1000, verbose_name="评论内容")
    now_time = models.DateTimeField("时间", default=timezone.now)

    def __str__(self):
        return self.new_info

    class Meta:
        db_table = 'comment'  # 评论新闻
        verbose_name_plural = "评论"
