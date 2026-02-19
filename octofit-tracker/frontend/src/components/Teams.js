import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  useEffect(() => {
    console.log('Fetching teams from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams API response:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams data:', teamsData);
        console.log('Team details:', teamsData.map(t => ({ 
          name: t.name, 
          member_count: t.member_count, 
          total_points: t.total_points 
        })));
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
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
        <strong>Loading teams...</strong>
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
      <h2 className="mb-4">🏆 OctoFit Teams</h2>
      <p className="lead text-muted mb-4">Compete with your team and dominate the leaderboard</p>
      
      <div className="row">
        {teams.map((team, index) => (
          <div key={team._id || index} className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">{team.name}</h5>
              </div>
              <div className="card-body">
                <p className="card-text text-muted">{team.description}</p>
                <hr />
                <div className="d-flex justify-content-around mt-3">
                  <div className="text-center">
                    <h3 className="text-primary mb-0">
                      {typeof team.member_count === 'number' ? team.member_count : 0}
                    </h3>
                    <small className="text-muted">👥 Members</small>
                  </div>
                  <div className="text-center">
                    <h3 className="text-success mb-0">
                      {typeof team.total_points === 'number' ? team.total_points : 0}
                    </h3>
                    <small className="text-muted">⭐ Total Points</small>
                  </div>
                </div>
              </div>
              <div className="card-footer text-center">
                <button className="btn btn-primary btn-sm">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {teams.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          No teams found. Create a team and start competing!
        </div>
      )}
    </div>
  );
}

export default Teams;
