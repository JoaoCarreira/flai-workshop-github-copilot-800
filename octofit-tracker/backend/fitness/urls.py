from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import views
import os

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'teams', views.TeamViewSet, basename='team')
router.register(r'activities', views.ActivityViewSet, basename='activity')
router.register(r'leaderboard', views.LeaderboardViewSet, basename='leaderboard')
router.register(r'workouts', views.WorkoutViewSet, basename='workout')


@api_view(['GET'])
def api_root(request, format=None):
    """
    API root endpoint that lists all available endpoints with codespace URLs
    """
    codespace_name = os.environ.get('CODESPACE_NAME', 'localhost:8000')
    
    if codespace_name and codespace_name != 'localhost:8000':
        base_url = f'https://{codespace_name}-8000.app.github.dev/api'
    else:
        base_url = f'{request.scheme}://{request.get_host()}/api'
    
    return Response({
        'users': f'{base_url}/users/',
        'teams': f'{base_url}/teams/',
        'activities': f'{base_url}/activities/',
        'leaderboard': f'{base_url}/leaderboard/',
        'workouts': f'{base_url}/workouts/',
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
]
