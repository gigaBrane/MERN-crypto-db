import React, { useContext } from 'react';
import { GlobalDispatchContext } from '../context/GlobalStateContext';
import { useNavigate } from 'react-router-dom'; // Use for redirect after logout

const LogoutButton = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user and token from global state and localStorage
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to the login page or home page
    navigate('/login'); // Change this to your desired redirect route
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
