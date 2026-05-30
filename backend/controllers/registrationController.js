const Registration = require('../models/Registration');
const Event = require('../models/Event');


//   POST /api/registrations

const createRegistration = async (req, res) => {
  try {
    const { eventId, name, email, phone, organization, seats, notes } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    if (!event.isActive) return res.status(400).json({ message: 'This event is no longer accepting registrations.' });

    const seatsRequested = Number(seats) || 1;
    if (event.registered + seatsRequested > event.capacity) {
      return res.status(400).json({ message: `Only ${event.capacity - event.registered} seat(s) remaining for this event.` });
    }

    // Prevent duplicate registration
    const duplicate = await Registration.findOne({ event: eventId, user: req.user._id, status: 'Confirmed' });
    if (duplicate) {
      return res.status(400).json({ message: 'You already have a confirmed registration for this event.' });
    }

    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
      name, email, phone, organization,
      seats: seatsRequested,
      notes,
    });

    // Update registered count on event
    event.registered += seatsRequested;
    await event.save();

    const populated = await Registration.findById(registration._id).populate('event', 'title date time venue');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//   GET /api/registrations/my

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title date time venue category')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  GET /api/registrations

const getAllRegistrations = async (req, res) => {
  try {
    const { eventId, status } = req.query;
    const query = {};
    if (eventId) query.event = eventId;
    if (status) query.status = status;

    const registrations = await Registration.find(query)
      .populate('event', 'title date venue')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//   PUT /api/registrations/:id/status

const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found.' });

    // If cancelling — free up seats
    if (status === 'Cancelled' && registration.status === 'Confirmed') {
      const event = await Event.findById(registration.event);
      if (event) {
        event.registered = Math.max(0, event.registered - registration.seats);
        await event.save();
      }
    }

    registration.status = status;
    await registration.save();

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    GET /api/registrations/export

const exportRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({})
      .populate('event', 'title date venue category')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const header = ['Registration ID', 'Name', 'Email', 'Phone', 'Organization', 'Event', 'Date', 'Venue', 'Seats', 'Status', 'Registered At'];
    const rows = registrations.map(r => [
      r.registrationId,
      r.name,
      r.email,
      r.phone,
      r.organization || '',
      r.event?.title || '',
      r.event?.date ? new Date(r.event.date).toLocaleDateString() : '',
      r.event?.venue || '',
      r.seats,
      r.status,
      new Date(r.createdAt).toLocaleString(),
    ]);

    const csv = [header, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="participants.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRegistration, getMyRegistrations, getAllRegistrations, updateRegistrationStatus, exportRegistrations };