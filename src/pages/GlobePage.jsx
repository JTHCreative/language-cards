import { useNavigate } from 'react-router-dom';
import Globe from '../components/Globe';
import { getCurrentUser } from '../utils/auth';
import '../styles/GlobePage.css';

export default function GlobePage({ onLogout }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleSelectLanguage = (language) => {
    navigate(`/language/${language.id}`);
  };

  return (
    <div className="globe-page">
      <header className="globe-header">
        <div className="header-left">
          <h1>Language Cards</h1>
        </div>
        <div className="header-right">
          <span className="username">Hi, {user?.username}</span>
          <button className="logout-btn" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </header>

      <div className="globe-container">
        <Globe onSelectLanguage={handleSelectLanguage} />
      </div>

      <div className="globe-instructions">
        <p>Drag to rotate the globe. Click on a country's flag to learn their language!</p>
      </div>
    </div>
  );
}
