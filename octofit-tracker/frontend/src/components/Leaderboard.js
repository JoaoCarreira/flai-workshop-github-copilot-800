import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    console.log('Fetching leaderboard from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard API response:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Leaderboard data:', leaderboardData);
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
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
        <strong>Loading leaderboard...</strong>
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

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankClass = (rank) => {
    if (rank <= 3) return 'table-warning';
    return '';
  };

  return (
    <div className="container">
      <h2 className="mb-4">🏆 Competitive Leaderboard</h2>
      <p className="lead text-muted mb-4">Top performers ranked by points - climb the ranks and become champion!</p>
      
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col" className="text-center" width="80">🏅 Rank</th>
              <th scope="col">👤 Name</th>
              <th scope="col">📧 Email</th>
              <th scope="col">👥 Team</th>
              <th scope="col" className="text-center">⭐ Points</th>
              <th scope="col" className="text-center">📊 Type</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry._id || index} className={getRankClass(entry.rank)}>
                <td className="text-center">
                  <span className={`badge ${entry.rank <= 3 ? 'bg-warning text-dark fs-6' : 'bg-secondary'}`}>
                    {getRankBadge(entry.rank)}
                  </span>
                </td>
                <td>
                  <strong>{entry.name}</strong>
                </td>
                <td className="text-muted">{entry.email}</td>
                <td>
                  <span className="badge bg-primary">{entry.team}</span>
                </td>
                <td className="text-center">
                  <span className="badge bg-success fs-6">{entry.points}</span>
                </td>
                <td className="text-center">
                  <span className="badge bg-info text-dark">{entry.type}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {leaderboard.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          No leaderboard entries yet. Start competing to see rankings!
        </div>
      )}
      
      <div className="text-center mt-4">
        <p className="text-muted">Total Competitors: <strong>{leaderboard.length}</strong></p>
      </div>
    </div>
  );
}

export default Leaderboard;
