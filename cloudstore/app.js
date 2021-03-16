
'use strict';
const process = require('process'); // Required to mock environment variables

const {format} = require('util');
const express = require('express');
const Multer = require('multer');
const bodyParser = require('body-parser');

const {Storage} = require('@google-cloud/storage');
// Instantiate a storage client
const storage = new Storage();

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const bucket = storage.bucket("functions-f.appspot.com");


app.get('/', (req, res) => {
  res.render('form.pug');
});

app.post('/upload', multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }
  const file = bucket.file(req.file.originalname);
  const fileStream = file.createWriteStream();
  fileStream.on('error', (err) => {
    next(err);
  });
  fileStream.on('finish', () => {
    const publicUrl = format(
      `บันทึกไฟล์สำเร็จ :==>${bucket.name} :: ${file.name}`);
    res.status(200).send(publicUrl);
  });
  fileStream.end(req.file.buffer);
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
// [END]
module.exports = app;
