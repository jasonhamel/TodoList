import express from "express";
import bodyParser from "body-parser";

const app = express();
let todayList = [];
let weekList = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("today.ejs", { page: "the Day", list: todayList });
});

app.get("/today", function (req, res) {
  res.redirect("/");
});

app.get("/week", function (req, res) {
  res.render("week.ejs", { page: "the Week", list: weekList });
});

app.post("/", function (req, res) {
  todayList.push(req.body.item);
  res.redirect("/");
});

app.post("/week", function (req, res) {
  weekList.push(req.body.item);
  res.redirect("/week");
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
