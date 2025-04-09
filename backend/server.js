const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/config');

// Connect to MongoDB
// Use the connection string from your config file
console.log('Connecting to MongoDB...');
console.log('MongoDB URI:', config.mongoURI);
mongoose.connect(config.mongoURI)
.then(() => {
  console.log('Connected to MongoDB');
  // Start the server
  const port = config.port || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});