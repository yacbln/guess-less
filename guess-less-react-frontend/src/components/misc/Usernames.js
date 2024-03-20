import './Usernames.css';

const Usernames = ({ usernames }) => {
    const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5','color-6'];
  
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {usernames.map((username, index) => (
          <div key={username} className={`username-box ${colorClasses[index % colorClasses.length]}`}>
            {username}
          </div>
        ))}
      </div>
    );
  };

export default Usernames;