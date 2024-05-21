const express = require('express');
const cors = require('cors');
const morgan =  require('morgan');
const { generateLetters } = require('../services/letter-generator');
const { selectRandomWords } = require('../services/word-selector');
const wordRoutes = require('../routes/word-routes');
const mwtRoutes = require('../routes/mwt-routes');
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use('/api/words', wordRoutes);
app.use('/api/', mwtRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

