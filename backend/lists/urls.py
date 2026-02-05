from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListViewSet, ListItemViewSet, login_view, logout_view, current_user_view

router = DefaultRouter()
router.register(r'lists', ListViewSet, basename='list')
router.register(r'items', ListItemViewSet, basename='listitem')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/user/', current_user_view, name='current-user'),
]
