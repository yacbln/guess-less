import './SessionOverModal.css';

function SessionOverModal({ isVisible, onClose,handleRejoinSession,handleGoingHome }) {
    if (!isVisible) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content" >
          <h4>Word: </h4>
          <h4>Winner: </h4>
          <p>Congrats or Better luck next time!</p>

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