import { useEffect, useState } from 'react';
import API from '../api/axios';
import EventCard from '../components/EventCard';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'all') params.append('category', category);
      const { data } = await API.get(`/events?${params}`);
      setEvents(data.events);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [search, category]);

  return (
    <div className="content">
      <section className="panel">
        <div className="panel-header">
          <h3>Browse events</h3>
          <div className="filter-row">
            <input className="search-input" placeholder="Search events…" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              <option>Technology</option>
              <option>Business</option>
              <option>Culture</option>
              <option>Workshop</option>
            </select>
          </div>
        </div>
        <div className="events-grid">
          {loading ? <p>Loading events…</p> : events.length ? events.map(ev => <EventCard key={ev._id} event={ev} />) : <div className="empty-state"><strong>No events found</strong></div>}
        </div>
      </section>
    </div>
  );
}