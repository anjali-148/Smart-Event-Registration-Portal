import { useEffect, useState } from 'react';
import API from '../api/axios';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

export default function OverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get('/events?limit=3').then(res => setEvents(res.data.events));
    if (user?.role === 'admin') {
      API.get('/events/stats').then(res => setStats(res.data));
    }
  }, [user]);

  return (
    <div className="content">
      <div className="hero">
        <div className="hero-card">
          <div className="eyebrow">Smart event operations</div>
          <h3>Run registrations without the spreadsheet mess.</h3>
          <p>Publish events, collect attendee data, issue QR tickets, and track registrations in real time.</p>
          <div className="cta-row">
            <a href="/register" className="btn btn-primary">Register for an event</a>
            <a href="/events" className="btn btn-secondary">Browse events</a>
          </div>
        </div>
        <div className="stats-grid">
          <div className="kpi-card"><small>Total events</small><strong>{stats.totalEvents ?? events.length}</strong></div>
          <div className="kpi-card"><small>Registrations</small><strong>{stats.totalRegistrations ?? '—'}</strong></div>
          <div className="kpi-card"><small>Seats booked</small><strong>{stats.totalRegistered ?? '—'}</strong></div>
          <div className="kpi-card"><small>Total capacity</small><strong>{stats.totalCapacity ?? '—'}</strong></div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header"><h3>Upcoming events</h3></div>
        <div className="events-grid">
          {events.map(ev => <EventCard key={ev._id} event={ev} />)}
        </div>
      </section>
    </div>
  );
}