import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EMPTY = { eventId: '', name: '', email: '', phone: '', organisation: '', seats: 1, notes: '' };

export default function RegistrationPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    ...EMPTY,
    name: user?.name || '',
    email: user?.email || '',
  });
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/events?limit=100').then(r => setEvents(r.data.events)).catch(() => {});
  }, []);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.eventId) { toast.error('Please select an event.'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/registrations', form);
      setTicket(data);
      toast.success('Registered! Your QR ticket is ready.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTicket(null);
    setForm({ ...EMPTY, name: user?.name || '', email: user?.email || '' });
  };

  return (
    <div className="content reg-page">

      {/* ── Full-width registration form ── */}
      <section className="panel reg-form-panel">
        <div className="panel-header">
          <div>
            <h3>Register for an event</h3>
            <p>Fill in your details and choose an event to secure your seat.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="reg-form">
          {/* Event select — full width */}
          <div className="field reg-full">
            <label htmlFor="eventId">Select event</label>
            <select
              id="eventId"
              name="eventId"
              className="input"
              required
              value={form.eventId}
              onChange={handleChange}
            >
              <option value="">— Choose an event —</option>
              {events.map(ev => (
                <option key={ev._id} value={ev._id}>
                  {ev.title} — {new Date(ev.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </option>
              ))}
            </select>
          </div>

          {/* Name + Email */}
          <div className="field">
            <label htmlFor="reg-name">Full name</label>
            <input id="reg-name" name="name" className="input" required
              value={form.name} onChange={handleChange} placeholder="Your full name" />
          </div>
          <div className="field">
            <label htmlFor="reg-email">Email</label>
            <input id="reg-email" name="email" type="email" className="input" required
              value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>

          {/* Phone + Organisation */}
          <div className="field">
            <label htmlFor="reg-phone">Phone <span className="faint">(optional)</span></label>
            <input id="reg-phone" name="phone" type="tel" className="input"
              value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
          </div>
          <div className="field">
            <label htmlFor="reg-org">Organisation <span className="faint">(optional)</span></label>
            <input id="reg-org" name="organisation" className="input"
              value={form.organisation} onChange={handleChange} placeholder="Company / College" />
          </div>

          {/* Seats — half width */}
          <div className="field">
            <label htmlFor="reg-seats">Number of seats</label>
            <input id="reg-seats" name="seats" type="number" min="1" max="10"
              className="input" required value={form.seats} onChange={handleChange} />
          </div>

          {/* Notes — full width */}
          <div className="field reg-full">
            <label htmlFor="reg-notes">Notes <span className="faint">(optional)</span></label>
            <textarea id="reg-notes" name="notes" className="textarea"
              value={form.notes} onChange={handleChange}
              placeholder="Accessibility requirements, dietary needs, etc." />
          </div>

          {/* Actions */}
          <div className="reg-full button-row">
            <button type="submit" className="btn btn-primary reg-submit" disabled={loading}>
              {loading ? 'Registering…' : 'Register & get ticket →'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              Clear form
            </button>
          </div>
        </form>
      </section>

      {/* ── QR Ticket — below the form ── */}
      <section className="panel ticket-result-panel">
        <div className="panel-header">
          <h3>Confirmation ticket</h3>
          {ticket && (
            <span className="badge badge-success">✓ Confirmed</span>
          )}
        </div>

        {!ticket ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎫</div>
            <strong>No registration yet</strong>
            <p>Submit the form above to generate your QR ticket.</p>
          </div>
        ) : (
          <div className="ticket-result">
            {/* Left: details */}
            <div className="ticket-result-info">
              <p className="ticket-event-name">{ticket.event?.title || 'Event'}</p>
              <div className="ticket-meta-grid">
                <div className="ticket-meta-item">
                  <span className="ticket-meta-label">Registration ID</span>
                  <span className="ticket-meta-value mono">{ticket.registrationId}</span>
                </div>
                <div className="ticket-meta-item">
                  <span className="ticket-meta-label">Name</span>
                  <span className="ticket-meta-value">{ticket.name}</span>
                </div>
                <div className="ticket-meta-item">
                  <span className="ticket-meta-label">Email</span>
                  <span className="ticket-meta-value">{ticket.email}</span>
                </div>
                <div className="ticket-meta-item">
                  <span className="ticket-meta-label">Seats</span>
                  <span className="ticket-meta-value">{ticket.seats}</span>
                </div>
                <div className="ticket-meta-item">
                  <span className="ticket-meta-label">Status</span>
                  <span className="ticket-meta-value status-confirmed">{ticket.status}</span>
                </div>
                {ticket.event?.date && (
                  <div className="ticket-meta-item">
                    <span className="ticket-meta-label">Date</span>
                    <span className="ticket-meta-value">
                      {new Date(ticket.event.date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long', year:'numeric' })}
                    </span>
                  </div>
                )}
                {ticket.event?.venue && (
                  <div className="ticket-meta-item">
                    <span className="ticket-meta-label">Venue</span>
                    <span className="ticket-meta-value">{ticket.event.venue}</span>
                  </div>
                )}
              </div>

              <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={handleReset}>
                Register for another event
              </button>
            </div>

            {/* Right: QR code */}
            <div className="ticket-result-qr">
              <div className="qr-container">
                <QRCodeSVG
                  value={ticket.qrData || ticket.registrationId}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="qr-label">Scan at venue entry</p>
              <p className="qr-id mono">{ticket.registrationId}</p>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}