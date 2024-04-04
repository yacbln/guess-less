import './SessionOverModal.css';

function SessionOverModal({ isVisible,onClose,handleRejoinSession,handleGoingHome,sessionStatus,wordWinner,usernameWinner}) {
    if (!isVisible) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content" >
          <h4>Word: {wordWinner}</h4>
          <h4>Winner: {usernameWinner}</h4>
          <p>{sessionStatus=='win'? "Congrats, you guessed it right!": "Better luck next time!"}</p>

          <button onClick={onClose}>Close</button>
          <div className="button-container" style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleRejoinSession} className="btn btn-primary">Rejoin</button>
            <button onClick={handleGoingHome} className="btn btn-primary">Home</button>
          </div>

        </div>
      </div>
    );
  }

export default SessionOverModal;