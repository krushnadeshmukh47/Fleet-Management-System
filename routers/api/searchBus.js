const express = require("express");
const auth = require("../../middleware/auth");
const Buses = require("../../models/Buses")
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const URL = require('../../config/default.json')
// console.log(URL.mongoURI)

router.get('/', (req, res) => res.send("bus part "))

router.post("/", async (req, res) => {
    try {
        const { name, company, stops, departureDateTime, arrivalTime, fare } = req.body; // Assuming you send these properties in the request body

        // Create a new bus instance
        const newBus = new Buses({
            name,
            company,
            stops,
            departureDateTime,
            arrivalTime,
            fare
        });

        // Save the new bus to the database
        const bus = await newBus.save();

        res.json(bus); // Send back the newly added bus as a response
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



// Router to search for buses based on start, end, and departure date
router.get("/:start/:end/:departureDate", async (req, res) => {
    const { start, end, departureDate } = req.params;
    const stops_ = [start, end];
    try {
        // Convert departureDate to a Date object
        const searchDate = new Date(departureDate);
        searchDate.setHours(0, 0, 0, 0); // Set time to midnight to ignore time component

        // Find buses that match the start and end stops and have departure date after searchDate
        const buses = await Buses.find({
            stops: { $all: stops_ },
            departureDateTime: {
                $gte: searchDate, // Greater than or equal to the searchDate
                $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000) // Less than the next day
            }
        });

        if (buses.length === 0) {
            res.send([]); // No matching buses found
        } else {
            const finalBuses = buses.filter(bus => {
                // Check if the bus stops match the start and end stops
                const stops = bus.stops;
                return JSON.stringify(stops) === JSON.stringify(stops_);
            });

            res.send(finalBuses); // Send the filtered buses as response
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;







module.exports = router;
