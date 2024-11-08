const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;

mongoose.connect(MONGODB_URL).then(() => console.log("Inhaler DB connected successfully")).catch((err) => console.log(err));

const schema = new mongoose.Schema({
    id: String,
    name: String,
    inhaled: [{
        time: {
            type: Date,
            default: Date.now()
        }
    }]
});

// const d = new Date(1731058084000)
// console.log(d.getHours())
console.log((Date.now()))

const inhaler = mongoose.model("inhaler", schema);

module.exports = inhaler