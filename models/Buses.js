const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    stops: {
        type: [String],
        required: true
    },
    departureDateTime: { // Modified field name to departureDateTime
        type: Date, // Include date and time
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    seats: [{
        number: { type: Number, required: true },
        booked: { type: Boolean, default: false }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to generate seat numbers
BusSchema.pre('save', function(next) {
    const bus = this;
    if (!bus.isNew) {
        return next(); // Skip if not a new bus
    }

    // Generate seat numbers
    const totalSeats = 30;
    for (let i = 1; i <= totalSeats; i++) {
        bus.seats.push({ number: i, booked: false });
    }
    next();
});

// Method to book a seat
BusSchema.methods.bookSeat = function(seatNumber) {
    const seat = this.seats.find(seat => seat.number === seatNumber);
    if (seat && !seat.booked) {
        seat.booked = true;
        return true; // Seat booked successfully
    }
    return false; // Seat already booked or does not exist
};

module.exports = mongoose.model('Bus', BusSchema);
