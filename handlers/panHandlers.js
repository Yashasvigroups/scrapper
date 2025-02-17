const { Pan } = require('../schema/panCards.schema');

async function addPAN(req, res) {
  try {
    const { panNumber } = req.body;

    if (!panNumber) {
      res.status(400).json({ message: 'enter pan number to add' });
      return;
    }

    const isAlreadyAdded = await Pan.countDocuments({
      panNumber,
    });
    if (isAlreadyAdded > 0) {
      res.status(409).json({ message: 'pan already in use by someone' });
      return;
    }

    await Pan.create({ panNumber, userId: req.userId });

    res.status(201).json({ message: 'pan added successfully' });
  } catch (err) {
    console.log('Failed adding pan: ', err?.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getPANs(req, res) {
  try {
    let pans = await Pan.find({ userId: req.userId }, { panNumber: 1, _id: 0 });

    res.status(200).json({ pans });
  } catch (err) {
    console.log('Failed get pans: ', err?.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function deletePAN(req, res) {
  try {
    const { panNumber } = req.body;

    if (!panNumber) {
      res.status(400).json({ message: 'enter pan number to delete' });
      return;
    }

    const isRegistered = await Pan.countDocuments({
      panNumber,
      userId: req.userId,
    });
    if (!isRegistered) {
      res.status(404).json({ message: 'pan not found' });
      return;
    }

    await Pan.deleteOne({ panNumber, userId: req.userId });

    res.status(200).json({ message: 'pan deleted successfully' });
  } catch (err) {
    console.log('Failed deleting pan: ', err?.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { addPAN, deletePAN, getPANs };
