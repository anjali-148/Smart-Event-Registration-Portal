import { useEffect, useState } from 'react';
import API from '../api/axios';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'Technology',
  date: '',
  time: '',
  venue: '',
  capacity: '',
};

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState({});

  const load = async () => {
    try {
      const [evRes, regRes, stRes] = await Promise.all([
        API.get('/events?limit=100'),
        API.get('/registrations'),
        API.get('/events/stats'),
      ]);
      setEvents(evRes.data.events);
      setRegistrations(regRes.data);
      setStats(stRes.data);
    } catch (err) {
      toast.error('Failed to load admin data.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/events/${editId}`, form);
        toast.success('Event updated successfully.');
      } else {
        await API.post('/events', form);
        toast.success('Event created successfully.');
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving event.');
    }
  };

  const handleEdit = (event) => {
    setEditId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date?.split('T')[0] || '',
      time: event.time || '',
      venue: event.venue,
      capacity: event.capacity,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try {
      await API.delete(`/events/${id}`);
      toast.success('Event deleted.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete event.');
    }
  };

  const handleClearForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const exportCSV = () => {
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_BASE_URL}/registrations/export`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'participants.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('CSV downloaded.');
      })
      .catch(() => toast.error('Export failed.'));
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/registrations/${id}/status`, { status });
      toast.success(`Status updated to ${status}.`);
      load();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="content">

      {/* KPI Stats */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <small>Total events</small>
          <strong>{stats.totalEvents ?? 0}</strong>
          <span className="muted">Active listings</span>
        </div>
        <div className="kpi-card">
          <small>Total capacity</small>
          <strong>{stats.totalCapacity ?? 0}</strong>
          <span className="muted">Seats across all events</span>
        </div>
        <div className="kpi-card">
          <small>Seats booked</small>
          <strong>{stats.totalRegistered ?? 0}</strong>
          <span className="muted">Real-time count</span>
        </div>
        <div className="kpi-card">
          <small>Registrations</small>
          <strong>{stats.totalRegistrations ?? 0}</strong>
          <span className="muted">Confirmed records</span>
        </div>
      </div>

      <div className="grid-2">

        {/* Event Form */}
        <section className="panel">
          <div className="panel-header">
            <h3>{editId ? 'Edit event' : 'Create new event'}</h3>
            {editId && (
              <button className="btn btn-ghost" onClick={handleClearForm}>
                Clear form
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field">
              <label htmlFor="title">Event title</label>
              <input
                id="title"
                name="title"
                className="input"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Future Tech Summit 2026"
              />
            </div>

            <div className="field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="select"
                value={form.category}
                onChange={handleChange}
              >
                <option>Technology</option>
                <option>Business</option>
                <option>Culture</option>
                <option>Workshop</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                className="input"
                required
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                name="time"
                type="time"
                className="input"
                required
                value={form.time}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="venue">Venue</label>
              <input
                id="venue"
                name="venue"
                className="input"
                required
                value={form.venue}
                onChange={handleChange}
                placeholder="e.g. Patna Convention Centre"
              />
            </div>

            <div className="field">
              <label htmlFor="capacity">Capacity</label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                className="input"
                required
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 200"
              />
            </div>

            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="textarea"
                required
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the event, sessions, and what attendees can expect."
              />
            </div>

            <div className="button-row" style={{ gridColumn: '1 / -1' }}>
              <button className="btn btn-primary" type="submit">
                {editId ? 'Update event' : 'Create event'}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={handleClearForm}
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* Participants Table */}
        <section className="panel">
          <div className="panel-header">
            <h3>Participants</h3>
            <button className="btn btn-secondary" onClick={exportCSV}>
              Export CSV
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Event</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length ? (
                  registrations.map((reg) => (
                    <tr key={reg._id}>
                      <td>
                        {reg.name}
                        <br />
                        <span className="muted">{reg.email}</span>
                      </td>
                      <td>{reg.event?.title ?? '—'}</td>
                      <td>{reg.seats}</td>
                      <td>{reg.status}</td>
                      <td style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {reg.status === 'Confirmed' && (
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: 'var(--text-xs)', minHeight: '32px', padding: '0.2rem 0.6rem' }}
                            onClick={() => handleStatusChange(reg._id, 'Attended')}
                          >
                            Attended
                          </button>
                        )}
                        {reg.status === 'Confirmed' && (
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: 'var(--text-xs)', minHeight: '32px', padding: '0.2rem 0.6rem' }}
                            onClick={() => handleStatusChange(reg._id, 'Cancelled')}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No registrations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Event Inventory */}
      <section className="panel">
        <div className="panel-header">
          <h3>Event inventory</h3>
          <span className="muted">Click Edit to load an event into the form above.</span>
        </div>
        <div className="events-grid">
          {events.length ? (
            events.map((ev) => (
              <EventCard
                key={ev._id}
                event={ev}
                adminMode
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <strong>No events yet</strong>
              <p>Use the form above to create your first event.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}