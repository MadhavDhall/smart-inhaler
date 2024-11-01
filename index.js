const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.get('/:msg', (req, res) => {
  console.log(req.params.msg)
  res.status(200).json({ message: 'hello' });
});

//post request
app.post('/upload', (req, res) => {
  console.log({ body: req.body });

  res.status(201).json(req.body);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`, "hehe");
});