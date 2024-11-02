require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const db = require("./db/inhaler");
const path = require('path');

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));  // Adjust path to locate "views" directory

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home');
});

//post request
app.post('/upload', (req, res) => {
  console.log({ body: req.body });

  res.status(201).json({ msg: "Finally done bro :)." });
});


// to show user data upon entering inhaler id
app.get("/user", async (req, res) => {
  const { inhalerId } = req.query;
  const inhaler = await db.findOne({ id: inhalerId });
  if (!inhaler) {
    res.render("confirm", { msg: "Invalid Inhaler Id", redirect: "/" });
  }
  res.render("user", { inhaler: inhaler });
});

// to post data that user inhaled
app.post("/inhaled", async (req, res) => {
  const { inhalerId } = req.body;
  const inhaler = await db.findOne({ id: inhalerId }).lean();
  if (!inhaler) {
    res.render("confirm", { msg: "Invalid Inhaler Id", redirect: "/" });
    return;
  }
  res.render("user", { data: inhaler });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`, "hehe");
});