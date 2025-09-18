from django.urls import path

from core import views

urlpatterns = [
    path('upload/', views.UploadFileView.as_view(), name='upload'),
    path('search/<str:index_name>/', views.SearchView.as_view(), name='search'),
]