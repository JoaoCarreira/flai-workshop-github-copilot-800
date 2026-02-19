import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', team: '' });
  const [saving, setSaving] = useState(false);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
  const TEAMS_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  useEffect(() => {
    console.log('Fetching users from:', API_URL);
    
    // Fetch users
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users API response:', data);
        const usersData = data.results || data;
        console.log('Users data:', usersData);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      });

    // Fetch teams
    fetch(TEAMS_URL)
      .then(response => response.json())
      .then(data => {
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      })
      .catch(error => console.error('Error fetching teams:', error));
  }, [API_URL, TEAMS_URL]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      team: user.team || ''
    });
  };

  const handleClose = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', team: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}${editingUser._id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      console.log('User updated:', updatedUser);

      // Update users list
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));

      handleClose();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="alert alert-info d-flex align-items-center" role="alert">
        <div className="spinner-border text-info me-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <strong>Loading users...</strong>
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
      <h2 className="mb-4">🏃‍♂️ OctoFit Users</h2>
      <p className="lead text-muted mb-4">Track all registered users and their fitness progress</p>
      
      <div className="row">
        {users.map((user, index) => (
          <div key={user._id || index} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">{user.name || 'Unknown User'}</h5>
                  <small className="text-white-50">@{user.email ? user.email.split('@')[0] : 'username'}</small>
                </div>
                <button 
                  className="btn btn-sm btn-light"
                  onClick={() => handleEdit(user)}
                  title="Edit user"
                >
                  ✏️
                </button>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>👤 Name:</strong></span>
                    <span className="text-muted">{user.name || 'N/A'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>📧 Email:</strong></span>
                    <span className="text-muted small">{user.email || 'N/A'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>👥 Team:</strong></span>
                    <span className="badge bg-primary rounded-pill">{user.team || 'No team'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>⭐ Points:</strong></span>
                    <span className="badge bg-success rounded-pill fs-6">{user.total_points || 0}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          No users found. Start your fitness journey today!
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">✏️ Edit User Details</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      <strong>👤 Name</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <strong>📧 Email</strong>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="team" className="form-label">
                      <strong>👥 Team</strong>
                    </label>
                    <select
                      className="form-select"
                      id="team"
                      name="team"
                      value={formData.team}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a team...</option>
                      {teams.map((team, idx) => (
                        <option key={team._id || idx} value={team.name}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleClose}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      '💾 Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
