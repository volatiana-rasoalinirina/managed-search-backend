from django.urls import path

from core import views

urlpatterns = [
    path('upload/', views.UploadFileView.as_view(), name='upload'),
]