from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListViewSet, ListItemViewSet, health_check

router = DefaultRouter()
router.register(r'lists', ListViewSet, basename='list')
router.register(r'items', ListItemViewSet, basename='listitem')

urlpatterns = [
    path('', include(router.urls)),
    path('health/', health_check, name='health-check'),
]
