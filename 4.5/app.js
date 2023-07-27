import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("today.ejs", { page: "the Day" });
});

app.get("/today", function (req, res) {
  res.redirect("/");
});

app.get("/week", function (req, res) {
  res.render("week.ejs", { page: "the Week" });
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
