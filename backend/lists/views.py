from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from .models import List, ListItem
from .serializers import ListSerializer, ListCreateSerializer, ListItemSerializer, UserSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Simple health check endpoint for Railway"""
    return Response({'status': 'healthy'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_token_view(request):
    """Endpoint to get CSRF token"""
    return Response({'detail': 'CSRF token set'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def debug_view(request):
    """Debug endpoint to check environment and cookies"""
    import os
    from django.conf import settings
    
    debug_info = {
        'frontend_url': os.environ.get('FRONTEND_URL', 'NOT SET'),
        'cors_origins': getattr(settings, 'CORS_ALLOWED_ORIGINS', []),
        'csrf_trusted_origins': getattr(settings, 'CSRF_TRUSTED_ORIGINS', []),
        'csrf_cookie_secure': getattr(settings, 'CSRF_COOKIE_SECURE', False),
        'csrf_cookie_samesite': getattr(settings, 'CSRF_COOKIE_SAMESITE', None),
        'csrf_cookie_httponly': getattr(settings, 'CSRF_COOKIE_HTTPONLY', True),
        'debug_mode': settings.DEBUG,
        'request_origin': request.headers.get('Origin', 'NO ORIGIN'),
        'request_host': request.get_host(),
        'cookies_in_request': list(request.COOKIES.keys()),
    }
    return Response(debug_info, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_view(request):
    username = request.data.get('username')

    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Get or create user with just username
    user, created = User.objects.get_or_create(username=username)
    login(request, user)

    return Response({
        'user': UserSerializer(user).data,
        'message': 'Logged in successfully'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    return Response(UserSerializer(request.user).data)


class ListViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ListSerializer

    def get_queryset(self):
        return List.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return ListCreateSerializer
        return ListSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ListItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ListItemSerializer

    def get_queryset(self):
        return ListItem.objects.filter(list__owner=self.request.user)

    def perform_create(self, serializer):
        list_obj = serializer.validated_data['list']
        if list_obj.owner != self.request.user:
            return Response({'error': 'You can only add items to your own lists'},
                          status=status.HTTP_403_FORBIDDEN)
        serializer.save()

    @action(detail=True, methods=['patch'])
    def toggle_check(self, request, pk=None):
        item = self.get_object()
        item.is_checked = not item.is_checked
        item.save()
        return Response(ListItemSerializer(item).data)
