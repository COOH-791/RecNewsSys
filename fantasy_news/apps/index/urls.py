from django.conf.urls import url

from .views import IndexView, NewListView, DetailView

urlpatterns = [
    url(r'^$', IndexView.as_view(), name="index"),
    url(r'^newslist', NewListView.as_view(), name="newlist"),
    url(r"^detail/(\d+)", DetailView.as_view(), name="datail")
]
