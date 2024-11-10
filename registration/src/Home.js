import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Ensure your CSS styles are in this file
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome styles

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers(); // Refresh user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Fetch users on page load
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="HomePage">
      <h1>Registered Users</h1>

      {/* User Cards */}
      <div className="user-cards-container">
        {users.map((user) => (
          <div className="user-card" key={user._id}>
            <h2>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Profession:</strong> {user.profession}</p>
            <div className="button-group">
              {/* Edit Button with Font Awesome Edit Icon */}
              <button onClick={() => navigate(`/edit/${user._id}`)} className="edit-button">
                <i className="fa fa-pencil" aria-hidden="true"></i> {/* Pencil icon */}
              </button>
              {/* Delete Button with Font Awesome Trash Icon */}
              <button onClick={() => handleDeleteUser(user._id)} className="delete-button">
                <i className="fa fa-trash" aria-hidden="true"></i> {/* Trash icon */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
