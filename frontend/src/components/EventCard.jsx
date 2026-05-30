import { useNavigate } from 'react-router-dom';

export default function EventCard({ event, onEdit, onDelete, adminMode }) {
  const navigate = useNavigate();
  const seatsLeft = event.capacity - event.registered;
  const date = new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <article className="event-card">
      <div className="event-meta">
        <span className="pill">{event.category}</span>
        <span className="pill">{date}</span>
        <span className="pill">{seatsLeft > 0 ? `${seatsLeft} seats left` : 'Sold out'}</span>
      </div>
      <div>
        <h4>{event.title}</h4>
        <p>{event.description}</p>
      </div>
      <p className="muted">{event.time} · {event.venue}</p>
      <div className="button-row">
        {adminMode ? (
          <>
            <button className="btn btn-secondary" onClick={() => onEdit(event)}>Edit</button>
            <button className="btn btn-danger" onClick={() => onDelete(event._id)}>Delete</button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            disabled={seatsLeft <= 0}
            onClick={() => navigate(`/register?eventId=${event._id}`)}
          >
            {seatsLeft > 0 ? 'Register now' : 'Full'}
          </button>
        )}
      </div>
    </article>
  );
}