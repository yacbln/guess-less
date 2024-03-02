import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Guess Less</h1>
      <p>Start or join a session with friends!</p>
      <div className="button-container">
        <Link to="/create-session" className="button">Create New Session</Link>
        <Link to="/join-session" className="button">Join Existing Session</Link>
      </div>
    </div>
  );
};

export default HomePage;