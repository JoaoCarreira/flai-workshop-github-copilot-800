import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Workouts from './components/Workouts';
import Leaderboard from './components/Leaderboard';

function Home() {
  return (
    <div className="container">
      <div className="jumbotron p-5">
        <h1 className="display-3 fw-bold">Welcome to OctoFit Tracker! 🏃‍♂️</h1>
        <p className="lead fs-4">
          Track your fitness journey, compete with your team, and achieve your health goals!
        </p>
        <hr className="my-4 bg-white" />
        <p className="fs-5">
          Explore user profiles, team standings, recent activities, personalized workouts, 
          and competitive leaderboards using the navigation menu above.
        </p>
        <div className="mt-4">
          <Link to="/workouts" className="btn btn-light btn-lg me-3">
            💪 Start Workout
          </Link>
          <Link to="/leaderboard" className="btn btn-outline-light btn-lg">
            🏆 View Rankings
          </Link>
        </div>
      </div>

      <div className="row mt-5 text-center">
        <div className="col-md-4 mb-4">
          <Link to="/users" className="text-decoration-none">
            <div className="card clickable-card">
              <div className="card-body">
                <div className="fs-1 mb-3">👥</div>
                <h5 className="card-title">User Profiles</h5>
                <p className="card-text text-muted">
                  Track individual progress and achievements
                </p>
                <span className="btn btn-primary btn-sm">View Users</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/teams" className="text-decoration-none">
            <div className="card clickable-card">
              <div className="card-body">
                <div className="fs-1 mb-3">🏆</div>
                <h5 className="card-title">Team Competition</h5>
                <p className="card-text text-muted">
                  Join forces and compete for glory
                </p>
                <span className="btn btn-primary btn-sm">View Teams</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/activities" className="text-decoration-none">
            <div className="card clickable-card">
              <div className="card-body">
                <div className="fs-1 mb-3">🔥</div>
                <h5 className="card-title">Activity Tracking</h5>
                <p className="card-text text-muted">
                  Log and monitor every workout
                </p>
                <span className="btn btn-primary btn-sm">View Activities</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="row mt-3 text-center">
        <div className="col-md-6 mb-4 offset-md-3">
          <Link to="/leaderboard" className="text-decoration-none">
            <div className="card clickable-card">
              <div className="card-body">
                <div className="fs-1 mb-3">🏅</div>
                <h5 className="card-title">Leaderboard Rankings</h5>
                <p className="card-text text-muted">
                  See who's leading the competition
                </p>
                <span className="btn btn-primary btn-sm">View Leaderboard</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src="/octofitapp-logo.png" alt="OctoFit Logo" />
              OctoFit Tracker
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
                    to="/"
                  >
                    🏠 Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
                    to="/users"
                  >
                    👥 Users
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
                    to="/teams"
                  >
                    🏆 Teams
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
                    to="/activities"
                  >
                    🔥 Activities
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
                    to="/workouts"
                  >
                    💪 Workouts
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
                    to="/leaderboard"
                  >
                    🏅 Leaderboard
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
