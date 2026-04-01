import { useNavigate } from 'react-router-dom';
import Globe from '../components/Globe';
import ProfileButton from '../components/ProfileButton';
import '../styles/GlobePage.css';

export default function GlobePage({ user, onLogout }) {
  const navigate = useNavigate();

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
          <ProfileButton user={user} onLogout={onLogout} />
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
