from django.core.management.base import BaseCommand
from fitness.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes unite for fitness!',
            total_points=0,
            member_count=0
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League members training for peak performance!',
            total_points=0,
            member_count=0
        )

        # Create Users (Superheroes)
        self.stdout.write('Creating users...')
        marvel_heroes = [
            {'name': 'Iron Man', 'email': 'tony.stark@avengers.com', 'team': 'Team Marvel'},
            {'name': 'Captain America', 'email': 'steve.rogers@avengers.com', 'team': 'Team Marvel'},
            {'name': 'Thor', 'email': 'thor.odinson@asgard.com', 'team': 'Team Marvel'},
            {'name': 'Black Widow', 'email': 'natasha.romanoff@shield.com', 'team': 'Team Marvel'},
            {'name': 'Hulk', 'email': 'bruce.banner@avengers.com', 'team': 'Team Marvel'},
            {'name': 'Spider-Man', 'email': 'peter.parker@marvel.com', 'team': 'Team Marvel'},
        ]

        dc_heroes = [
            {'name': 'Superman', 'email': 'clark.kent@dailyplanet.com', 'team': 'Team DC'},
            {'name': 'Batman', 'email': 'bruce.wayne@wayneenterprises.com', 'team': 'Team DC'},
            {'name': 'Wonder Woman', 'email': 'diana.prince@themyscira.com', 'team': 'Team DC'},
            {'name': 'Flash', 'email': 'barry.allen@starlabs.com', 'team': 'Team DC'},
            {'name': 'Aquaman', 'email': 'arthur.curry@atlantis.com', 'team': 'Team DC'},
            {'name': 'Green Lantern', 'email': 'hal.jordan@oa.com', 'team': 'Team DC'},
        ]

        all_heroes = marvel_heroes + dc_heroes
        users = []
        
        for hero in all_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team=hero['team'],
                total_points=random.randint(500, 2000)
            )
            users.append(user)

        # Update team member counts and points
        team_marvel.member_count = len(marvel_heroes)
        team_marvel.total_points = sum(u.total_points for u in users if u.team == 'Team Marvel')
        team_marvel.save()

        team_dc.member_count = len(dc_heroes)
        team_dc.total_points = sum(u.total_points for u in users if u.team == 'Team DC')
        team_dc.save()

        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Super Soldier Sprint',
                'description': 'High-intensity sprint training worthy of Captain America',
                'category': 'Cardio',
                'difficulty': 'Hard',
                'duration': 30,
                'calories_per_session': 400,
                'points_per_session': 50
            },
            {
                'name': 'Hulk Smash Strength',
                'description': 'Heavy lifting and power training',
                'category': 'Strength',
                'difficulty': 'Hard',
                'duration': 45,
                'calories_per_session': 350,
                'points_per_session': 60
            },
            {
                'name': 'Spider-Man Flexibility Flow',
                'description': 'Web-slinging inspired flexibility and balance',
                'category': 'Flexibility',
                'difficulty': 'Medium',
                'duration': 25,
                'calories_per_session': 200,
                'points_per_session': 30
            },
            {
                'name': 'Batman Ninja Training',
                'description': 'Martial arts and agility drills',
                'category': 'Agility',
                'difficulty': 'Hard',
                'duration': 40,
                'calories_per_session': 450,
                'points_per_session': 55
            },
            {
                'name': 'Flash Speed Training',
                'description': 'Lightning-fast cardio intervals',
                'category': 'Cardio',
                'difficulty': 'Hard',
                'duration': 20,
                'calories_per_session': 500,
                'points_per_session': 65
            },
            {
                'name': 'Wonder Woman Warrior Workout',
                'description': 'Full-body combat training',
                'category': 'Full Body',
                'difficulty': 'Medium',
                'duration': 35,
                'calories_per_session': 380,
                'points_per_session': 45
            },
            {
                'name': 'Aquaman Swim Session',
                'description': 'Underwater endurance training',
                'category': 'Cardio',
                'difficulty': 'Medium',
                'duration': 30,
                'calories_per_session': 300,
                'points_per_session': 40
            },
            {
                'name': 'Iron Man Core Circuit',
                'description': 'Advanced core strengthening routine',
                'category': 'Core',
                'difficulty': 'Medium',
                'duration': 25,
                'calories_per_session': 250,
                'points_per_session': 35
            },
        ]

        workouts = []
        for workout_data in workouts_data:
            workout = Workout.objects.create(**workout_data)
            workouts.append(workout)

        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Swimming', 'Cycling', 'Weight Training', 'Yoga', 'Boxing', 'HIIT']
        
        for user in users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_date = datetime.now() - timedelta(days=random.randint(0, 30))
                duration = random.randint(20, 90)
                calories = duration * random.randint(8, 15)
                points = calories // 10
                
                Activity.objects.create(
                    user_email=user.email,
                    activity_type=random.choice(activity_types),
                    duration=duration,
                    calories=calories,
                    points=points,
                    date=activity_date,
                    notes=f'Training session for {user.name}'
                )

        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard...')
        
        # User leaderboard
        sorted_users = sorted(users, key=lambda x: x.total_points, reverse=True)
        for rank, user in enumerate(sorted_users, start=1):
            Leaderboard.objects.create(
                type='user',
                name=user.name,
                email=user.email,
                team=user.team,
                points=user.total_points,
                rank=rank
            )

        # Team leaderboard
        teams = [team_marvel, team_dc]
        sorted_teams = sorted(teams, key=lambda x: x.total_points, reverse=True)
        for rank, team in enumerate(sorted_teams, start=1):
            Leaderboard.objects.create(
                type='team',
                name=team.name,
                team=team.name,
                points=team.total_points,
                rank=rank
            )

        # Create unique index on email field
        self.stdout.write('Creating unique index on user email...')
        try:
            from pymongo import MongoClient
            client = MongoClient('localhost', 27017)
            db = client.octofit_db
            db.users.create_index('email', unique=True)
            self.stdout.write(self.style.SUCCESS('Unique index created on email field'))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Could not create index: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully populated database!'))
        self.stdout.write(self.style.SUCCESS(f'  - Created {len(teams)} teams'))
        self.stdout.write(self.style.SUCCESS(f'  - Created {len(users)} users'))
        self.stdout.write(self.style.SUCCESS(f'  - Created {len(workouts)} workouts'))
        self.stdout.write(self.style.SUCCESS(f'  - Created {Activity.objects.count()} activities'))
        self.stdout.write(self.style.SUCCESS(f'  - Created {Leaderboard.objects.count()} leaderboard entries'))
