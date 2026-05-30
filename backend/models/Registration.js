const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled', 'Attended'],
      default: 'Confirmed',
    },
    qrData: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-generate registration ID before saving
registrationSchema.pre('save', function (next) {
  if (!this.registrationId) {
    this.registrationId = `REG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  if (!this.qrData) {
    this.qrData = JSON.stringify({
      registrationId: this.registrationId,
      name: this.name,
      email: this.email,
      seats: this.seats,
    });
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);