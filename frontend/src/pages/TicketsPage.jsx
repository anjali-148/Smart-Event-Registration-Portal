import { useEffect, useState } from 'react';
import API from '../api/axios';
import TicketCard from '../components/TicketCard';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    API.get('/registrations/my').then(res => setTickets(res.data));
  }, []);

  return (
    <div className="content">
      <section className="panel">
        <div className="panel-header"><h3>Your tickets</h3></div>
        <div className="tickets-grid">
          {tickets.length
            ? tickets.map(ticket => <TicketCard key={ticket._id} registration={ticket} />)
            : <div className="empty-state" style={{ gridColumn: '1/-1' }}><strong>No tickets yet</strong><p>Register for an event to receive your QR pass.</p></div>
          }
        </div>
      </section>
    </div>
  );
}
