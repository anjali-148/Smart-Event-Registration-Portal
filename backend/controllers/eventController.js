const Event = require('../models/Event');
const Registration = require('../models/Registration');


//   GET /api/events

const getEvents = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ events, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//    GET /api/events/:id

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//   POST /api/events

const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, venue, capacity } = req.body;

    const event = await Event.create({
      title, description, category, date, time, venue,
      capacity: Number(capacity),
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  PUT /api/events/:id

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    const { title, description, category, date, time, venue, capacity, isActive } = req.body;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (category !== undefined) event.category = category;
    if (date !== undefined) event.date = date;
    if (time !== undefined) event.time = time;
    if (venue !== undefined) event.venue = venue;
    if (capacity !== undefined) event.capacity = Number(capacity);
    if (isActive !== undefined) event.isActive = isActive;

    const updated = await event.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  DELETE /api/events/:id

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    const hasRegistrations = await Registration.exists({ event: req.params.id, status: 'Confirmed' });
    if (hasRegistrations) {
      return res.status(400).json({ message: 'Cannot delete an event with active confirmed registrations.' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//   GET /api/events/stats

const getEventStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments({ isActive: true });
    const totalCapacity = await Event.aggregate([{ $group: { _id: null, total: { $sum: '$capacity' } } }]);
    const totalRegistered = await Event.aggregate([{ $group: { _id: null, total: { $sum: '$registered' } } }]);
    const totalRegistrations = await Registration.countDocuments({ status: 'Confirmed' });

    res.json({
      totalEvents,
      totalCapacity: totalCapacity[0]?.total || 0,
      totalRegistered: totalRegistered[0]?.total || 0,
      totalRegistrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventStats };