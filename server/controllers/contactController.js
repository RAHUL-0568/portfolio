const Inquiry = require('../models/Inquiry');

// Submit an Inquiry (Public)
exports.submitInquiry = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'Please provide name, email, and message.' });
  }

  try {
    const newInquiry = new Inquiry({ name, email, message });
    await newInquiry.save();

    // Log the event locally for dev/ops audit
    console.log(`[CONTACT LOG] Message received from ${name} (${email}): "${message.slice(0, 50)}..."`);

    res.json({ msg: 'Thank you! Your message has been received successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Inquiries (Admin Only)
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Mark Inquiry as Read (Admin Only)
exports.markRead = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ msg: 'Inquiry not found.' });
    }

    inquiry.read = true;
    await inquiry.save();

    res.json(inquiry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Inquiry (Admin Only)
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ msg: 'Inquiry not found.' });
    }

    await inquiry.deleteOne();
    res.json({ msg: 'Inquiry successfully deleted.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
