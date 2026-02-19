import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    console.log('Fetching workouts from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts API response:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts data:', workoutsData);
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return (
    <div className="container mt-4">
      <div className="alert alert-info d-flex align-items-center" role="alert">
        <div className="spinner-border text-info me-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <strong>Loading workouts...</strong>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'Easy': 'success',
      'Medium': 'warning',
      'Hard': 'danger'
    };
    return badges[difficulty] || 'secondary';
  };

  return (
    <div className="container">
      <h2 className="mb-4">💪 Personalized Workouts</h2>
      <p className="lead text-muted mb-4">Choose from our curated workout plans tailored to your fitness goals</p>
      
      <div className="row">
        {workouts.map((workout, index) => (
          <div key={workout._id || index} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{workout.name}</h5>
                <span className={`badge bg-${getDifficultyBadge(workout.difficulty)}`}>
                  {workout.difficulty}
                </span>
              </div>
              <div className="card-body">
                <p className="card-text text-muted">{workout.description}</p>
                <hr />
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>📂 Category:</strong></span>
                    <span className="badge bg-info text-dark">{workout.category}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>⏱️ Duration:</strong></span>
                    <span className="badge bg-primary">{workout.duration} min</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>🔥 Calories:</strong></span>
                    <span className="badge bg-warning text-dark">{workout.calories_per_session}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>⭐ Points:</strong></span>
                    <span className="badge bg-success">{workout.points_per_session}</span>
                  </li>
                </ul>
              </div>
              <div className="card-footer text-center">
                <button className="btn btn-primary btn-sm">Start Workout</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {workouts.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          No workouts available. Check back soon for new workout plans!
        </div>
      )}
    </div>
  );
}

export default Workouts;
