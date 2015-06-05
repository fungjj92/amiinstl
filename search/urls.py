__author__ = 'jenny'

from django.conf.urls import url
from search import views

urlpatterns = [
    url(r'^$', views.index, name="index"), #main, index. ONLY VISUAL VIEW
    url(r'^search/new', views.newSearch), # AJAX VISUALIZATIONS VV
]