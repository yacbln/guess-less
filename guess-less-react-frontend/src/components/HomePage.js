import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from '../images/logo.png'

const HomePage = () => {
  return (
    <div className="home-container">
    <img src={logo} alt="Logo" className="logo-placeholder" />
      <h1>Welcome to Guess Less</h1>
      <p>Start or join a session with friends!</p>
      <div className="buttons">
        <Link to="/create-session" className="btn btn-primary" style={{ marginRight: '20px' }}>Create New Session</Link>
        <Link to="/join-session" className="btn btn-primary">Join Existing Session</Link>
      </div>
    </div>
  );
};

export default HomePage;