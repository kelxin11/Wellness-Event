const express = require("express");
const router = express.Router();
const Event = require("../models/event");

// 1. Creave event HR
router.post("/create", async (req, res) => {
  try {
    const {
      eventName,
      hrUser,
      companyName,
      eventType,
      proposedDates,
      location,
    } = req.body;

    const newEvent = new Event({
      eventName,
      hrUser,
      companyName,
      eventType,
      proposedDates,
      location: {
        streetName: location.streetName,
        venueDetails: location.venueDetails,
        postalCode: location.postalCode,
        state: location.state,
        country: location.country,
      },
      status: "Pending",
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ success: true, data: savedEvent });
  } catch (err) {
    console.error("Creation Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// 2. get Events (With filtering logic for HR vs Vendor)
router.get("/", async (req, res) => {
  try {
    const { vendorType, companyName, vendorId } = req.query;
    let query = {};

    // 1. HR dashboard
    if (companyName) {
      query.companyName = companyName;
    }
    // 2. Vendor dashboard
    else if (vendorType) {
      const tagsArray = vendorType.split(",");

      const VendorType = require("../models/vendorType");
      const categories = await VendorType.find({ name: { $in: tagsArray } });
      const categoryIds = categories.map((cat) => cat._id);

      query.$or = [
        {
          eventType: { $in: categoryIds },
          status: "Pending",
        },
        {
          status: { $in: ["Approved", "Rejected"] },
          vendorId: vendorId,
        },
      ];
    }

    const events = await Event.find(query).populate("eventType", "name");

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. EDIT Event
router.patch("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending events can be edited" });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Vendor approve
router.patch("/approve/:id", async (req, res) => {
  try {
    const { selectedDate, vendorId, vendorName } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "Approved";
    event.confirmedDate = selectedDate;

    event.vendorId = vendorId;
    event.vendorName = vendorName;

    await event.save();
    res.json({ message: "Event approved and vendor assigned", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Vendor reject
router.patch("/reject/:id", async (req, res) => {
  try {
    const { reason, vendorId, vendorName } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: "Rejected",
        rejectionReason: reason,
        vendorId: vendorId,
        vendorName: vendorName,
      },
      { new: true },
    );

    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
