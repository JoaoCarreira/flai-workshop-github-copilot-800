from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from datetime import datetime
from .models import User, Team, Activity, Leaderboard, Workout


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='Test Hero',
            email='test@hero.com',
            team='Test Team',
            total_points=100
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, 'Test Hero')
        self.assertEqual(self.user.email, 'test@hero.com')
        self.assertEqual(self.user.team, 'Test Team')
        self.assertEqual(self.user.total_points, 100)

    def test_user_str(self):
        self.assertEqual(str(self.user), 'Test Hero')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Test Team',
            description='A test team',
            total_points=1000,
            member_count=5
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Test Team')
        self.assertEqual(self.team.description, 'A test team')
        self.assertEqual(self.team.total_points, 1000)
        self.assertEqual(self.team.member_count, 5)

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Test Team')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_email='test@hero.com',
            activity_type='Running',
            duration=30,
            calories=300,
            points=30,
            date=datetime.now(),
            notes='Test activity'
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.user_email, 'test@hero.com')
        self.assertEqual(self.activity.activity_type, 'Running')
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.calories, 300)
        self.assertEqual(self.activity.points, 30)


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Test Workout',
            description='A test workout',
            category='Cardio',
            difficulty='Medium',
            duration=30,
            calories_per_session=300,
            points_per_session=30
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Test Workout')
        self.assertEqual(self.workout.category, 'Cardio')
        self.assertEqual(self.workout.difficulty, 'Medium')
        self.assertEqual(self.workout.duration, 30)

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Test Workout')


class UserAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='API Test Hero',
            email='api@hero.com',
            team='API Team',
            total_points=200
        )
        self.url = reverse('user-list')

    def test_get_users_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {
            'name': 'New Hero',
            'email': 'new@hero.com',
            'team': 'New Team',
            'total_points': 0
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeamAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='API Team',
            description='API test team',
            total_points=500,
            member_count=3
        )
        self.url = reverse('team-list')

    def test_get_teams_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        data = {
            'name': 'New Team',
            'description': 'A new team',
            'total_points': 0,
            'member_count': 0
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_email='api@hero.com',
            activity_type='Swimming',
            duration=45,
            calories=450,
            points=45,
            date=datetime.now()
        )
        self.url = reverse('activity-list')

    def test_get_activities_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='API Workout',
            description='API test workout',
            category='Strength',
            difficulty='Hard',
            duration=60,
            calories_per_session=600,
            points_per_session=60
        )
        self.url = reverse('workout-list')

    def test_get_workouts_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTest(APITestCase):
    def test_api_root(self):
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)
