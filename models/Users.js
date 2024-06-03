const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true
    },
    seatNumbers: {
      type: [Number],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    contact: {
        type: String
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        required: true
    },
    tickets: [TicketSchema],

    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = User = mongoose.model('user', UserSchema)