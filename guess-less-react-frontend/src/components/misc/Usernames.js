import './Usernames.css';

const Usernames = ({ usernames, indexShow=-1}) => {
    const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5','color-6'];
    if (indexShow == -1){
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {usernames.map((username, index) => (
          <div key={username} className={`username-box ${colorClasses[index % colorClasses.length]}`}>
            {username}
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {usernames.map((username, index) => (

            <div key={username} className={`username-box ${index === indexShow ? colorClasses[index % colorClasses.length]: 'username-box-hidden'}`}  >
              {username}
            </div>

        ))}
      </div>
    );
    };
}

export default Usernames;