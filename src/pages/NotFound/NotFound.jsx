import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Estamos trabajando en ello</h2>
      <p>Esta página estará disponible próximamente.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

export default NotFound;