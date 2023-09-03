import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
let todayList = [];
let weekList = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a task"],
  },
});

const Item = mongoose.model("Item", itemsSchema);

const defaultItem1 = new Item({
  title: "Three",
});

const defaultItem2 = new Item({
  title: "Example",
});
const defaultItem3 = new Item({
  title: "Tasks",
});

const defaultItems = [defaultItem1, defaultItem2, defaultItem3];

app.get("/", async function (req, res) {
  const emptyCheck = await Item.find();

  if (emptyCheck.length == 0) {
    await Item.insertMany(defaultItems);
  }

  const foundItems = await Item.find();

  res.render("today.ejs", { page: "the Day", list: foundItems });
});

app.get("/today", function (req, res) {
  res.redirect("/");
});

app.get("/week", function (req, res) {
  res.render("week.ejs", { page: "the Week", list: weekList });
});

app.post("/", async function (req, res) {
  const itemName = req.body.item;
  const newItem = new Item({
    title: itemName,
  });
  newItem.save();
  res.redirect("/");
});

app.post("/week", function (req, res) {
  weekList.push(req.body.item);
  res.redirect("/week");
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
