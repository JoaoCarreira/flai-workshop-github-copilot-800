import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  useEffect(() => {
    console.log('Fetching activities from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities API response:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities data:', activitiesData);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
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
        <strong>Loading activities...</strong>
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

  return (
    <div className="container">
      <h2 className="mb-4">🔥 Recent Activities</h2>
      <p className="lead text-muted mb-4">Track all fitness activities across the platform</p>
      
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">👤 User</th>
              <th scope="col">🏃 Activity Type</th>
              <th scope="col" className="text-center">⏱️ Duration (min)</th>
              <th scope="col" className="text-center">🔥 Calories</th>
              <th scope="col" className="text-center">⭐ Points</th>
              <th scope="col">📅 Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity._id || index}>
                <td>
                  <strong>{activity.user_email}</strong>
                </td>
                <td>
                  <span className="badge bg-primary">{activity.activity_type}</span>
                </td>
                <td className="text-center">
                  <span className="badge bg-info text-dark">{activity.duration}</span>
                </td>
                <td className="text-center">
                  <span className="badge bg-warning text-dark">{activity.calories}</span>
                </td>
                <td className="text-center">
                  <span className="badge bg-success">{activity.points}</span>
                </td>
                <td className="text-muted">
                  {new Date(activity.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {activities.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          No activities recorded yet. Start your first workout!
        </div>
      )}
      
      <div className="text-center mt-4">
        <p className="text-muted">Total Activities: <strong>{activities.length}</strong></p>
      </div>
    </div>
  );
}

export default Activities;
