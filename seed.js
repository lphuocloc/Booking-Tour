require('dotenv').config();
const mongoose = require('mongoose');
const Tour = require('./models/tour');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tour-booking').then(async () => {
  await Tour.deleteMany();
  await Tour.insertMany([
    { title: 'Ha Long Bay Day Trip', price: 50, description: 'Explore the stunning limestone karsts of Ha Long Bay.' },
    { title: 'Hoi An Ancient Town Walk', price: 20, description: 'Guided walking tour through the lantern-lit streets of Hoi An.' },
    { title: 'Sapa Trekking Weekend', price: 120, description: 'Trek the terraced rice fields and visit local villages in Sapa.' }
  ]);
  console.log('DB seeded!');
  mongoose.connection.close();
});
