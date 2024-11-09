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

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// to show user data upon entering inhaler id
app.get("/user", async (req, res) => {
  try {
    const { inhalerId } = req.query;
    const inhaler = await db.findOne({ id: inhalerId });
    if (!inhaler) {
      res.render("confirm", { msg: "Invalid Inhaler Id", redirect: "/" });
    }
    console.log(inhaler);

    // calculating inhaled how many times inhaled from smart inhaler today
    let todayInhaled = 0;
    inhaler.inhaled.forEach((inhaled) => {
      if (new Date(inhaled.time).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata"
        , year: "numeric", month: "long", day: "numeric"
      }) === new Date().toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata"
        , year: "numeric", month: "long", day: "numeric"
      })) {
        todayInhaled = todayInhaled + 1;
      }
    })

    res.render("user", { data: inhaler.inhaled, name: inhaler.name, id: inhalerId, todayInhaled: todayInhaled });
  } catch (error) {
    res.render("confirm", { msg: "Invalid Inhaler Id", redirect: "/" });
  }
});

// to post data that user inhaled
app.post("/inhaled", async (req, res) => {
  const { id } = req.body;
  // console.log(req.body);

  const inhaler = await db.findOne({ id: id });
  if (!inhaler) {
    return res.json({ msg: "Invalid Inhaler Id" });
  }
  // res.render("user", { data: inhaler });

  const result = await db.updateOne(
    { id: id },
    { $push: { inhaled: { time: Date.now() } } },
    { new: true } // Return the updated document
  );

  const user = await db.findOne({ id: id });
  console.log(user);
  return res.json(result);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`, "hehe");
});