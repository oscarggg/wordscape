const express = require('express');
const cors = require('cors');
const morgan =  require('morgan');
// const { generateLetters } = require('../services/letter-generator');
const { selectWords } = require('../services/word-selector');
const app = express();

app.use(cors());
app.use(morgan('dev'));

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

selectWords();

