const express = require("express");
const Buses = require("../../models/Buses");
const router = express.Router();

router.get('/', (req, res) => res.send("bus part"));

// Route to create a bus
router.post("/", async (req, res) => {
    try {
        const { name, company, stops, departureDateTime, arrivalTime, fare } = req.body;
        const newBus = new Buses({
            name,
            company,
            stops,
            departureDateTime,
            arrivalTime,
            fare
        });
        const bus = await newBus.save();
        res.json(bus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Route to get bus details using start, end and departure date
router.get("/:start/:end/:departureDate", async (req, res) => {
    const { start, end, departureDate } = req.params;
    const stops_ = [start, end];
    try {
        const searchDate = new Date(departureDate);
        searchDate.setHours(0, 0, 0, 0);
        const buses = await Buses.find({
            stops: { $all: stops_ },
            departureDateTime: {
                $gte: searchDate,
                $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (buses.length === 0) {
            res.send([]);
        } else {
            const finalBuses = buses.filter(bus => {
                const stops = bus.stops;
                return JSON.stringify(stops) === JSON.stringify(stops_);
            });

            res.send(finalBuses);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route to get bus using id
router.get('/:id', async (req, res) => {
    try {
        const bus = await Buses.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.json(bus);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to book seats and store ticket
/*router.post('/:id/book-seats', async (req, res) => {
    try {
      const { seatNumbers, userId, amount } = req.body;
      const bus = await Bus.findById(req.params.id);
      const user = await User.findById(userId);
  
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const success = seatNumbers.every(seatNumber => bus.bookSeat(seatNumber));
      if (success) {
        await bus.save();
  
        // Generate ticket
        const ticket = {
          busId: bus._id,
          seatNumbers: seatNumbers,
          amount: amount,
          bookingDate: new Date()
        };
  
        // Store ticket in user's profile
        user.tickets.push(ticket);
        await user.save();
  
        res.json({ success: true, ticket: ticket });
      } else {
        res.json({ success: false, message: 'One or more seats already booked or do not exist' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });*/

router.post('/:id/book-seats', async (req, res) => {
    try {
      const { seatNumbers } = req.body;
      const bus = await Buses.findById(req.params.id);
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      const success = seatNumbers.every(seatNumber => bus.bookSeat(seatNumber));
      if (success) {
        await bus.save();
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'One or more seats already booked or do not exist' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }); 

module.exports = router;