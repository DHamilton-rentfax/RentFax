// backend/controllers/rentalEventController.js
import RentalEvent from '../models/RentalEvent.js';

// ✅ GET /api/rental-events
export async function getEvents(req, res, next) {
  try {
    const events = await RentalEvent.find({ applicantId: req.user.id }).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

// ✅ POST /api/rental-events
export async function createEvent(req, res, next) {
  try {
    const { applicantId, date, type, description } = req.body;
    const event = new RentalEvent({
      applicantId,
      date,
      type,
      description,
      createdBy: req.user.id,
    });
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}

// ✅ PUT /api/rental-events/:id
export async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await RentalEvent.findByIdAndUpdate(
      id,
      { ...updates, createdBy: req.user.id },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// ✅ DELETE /api/rental-events/:id
export async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await RentalEvent.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
}
