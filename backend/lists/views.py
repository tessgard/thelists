from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from .models import List, ListItem
from .serializers import ListSerializer, ListCreateSerializer, ListItemSerializer


class PublicRateThrottle(AnonRateThrottle):
    """Custom rate throttle for public endpoints"""
    scope = 'public_api'


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Simple health check endpoint for Railway"""
    return Response({'status': 'healthy'}, status=status.HTTP_200_OK)


class ListViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ListSerializer
    throttle_classes = [PublicRateThrottle]
    queryset = List.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return ListCreateSerializer
        return ListSerializer


class ListItemViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ListItemSerializer
    throttle_classes = [PublicRateThrottle]
    queryset = ListItem.objects.all()

    @action(detail=True, methods=['patch'])
    def toggle_check(self, request, pk=None):
        item = self.get_object()
        item.is_checked = not item.is_checked
        item.save()
        return Response(ListItemSerializer(item).data)
