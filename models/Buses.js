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
    departureDateTime: {
        type: Date,
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

BusSchema.pre('save', function(next) {
    const bus = this;
    if (!bus.isNew) {
        return next();
    }

    const totalSeats = 30;
    for (let i = 1; i <= totalSeats; i++) {
        bus.seats.push({ number: i, booked: false });
    }
    next();
});

BusSchema.methods.bookSeat = function(seatNumber) {
    const seat = this.seats.find(seat => seat.number === seatNumber);
    if (seat && !seat.booked) {
        seat.booked = true;
        return true;
    }
    return false;
};

module.exports = mongoose.model('Bus', BusSchema);
