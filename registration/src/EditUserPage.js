import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./edit.css"

const EditUserPage = () => {
  const { id } = useParams();  // Get the user ID from the URL
  const navigate = useNavigate(); // Initialize navigate function

  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
  });

  // Fetch the user data when the page loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  // Handle form submission (updating user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, user);  // Update the user
      navigate('/Home');  // Navigate to HomePage after the update
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="EditUserPage">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={user.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="profession"
          placeholder="Profession"
          value={user.profession}
          onChange={handleChange}
        />
        <button type="submit">Update User</button>
      </form>
    </div>
  );
};

export default EditUserPage;
