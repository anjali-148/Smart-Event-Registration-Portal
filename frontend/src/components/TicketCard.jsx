import { QRCodeCanvas } from 'qrcode.react';

export default function TicketCard({ registration }) {
  const event = registration.event;
  const date = event?.date ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const qrValue = registration.qrData || JSON.stringify({
    id: registration.registrationId,
    name: registration.name,
    email: registration.email,
    event: event?.title,
  });

  return (
    <article className="ticket-card">
      <div>
        <div className="eyebrow">{registration.registrationId}</div>
        <h4>{event?.title ?? 'Event'}</h4>
        <p>{date} at {event?.time} · {event?.venue}</p>
        <p><strong>{registration.name}</strong> · {registration.email}</p>
        <p>{registration.seats} seat(s) · <span className={`status-${registration.status.toLowerCase()}`}>{registration.status}</span></p>
      </div>
      <div className="qr-box">
        <QRCodeCanvas value={qrValue} size={116} bgColor="#ffffff" fgColor="#111111" level="M" />
      </div>
    </article>
  );
}