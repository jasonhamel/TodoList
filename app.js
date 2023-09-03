import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();

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

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", async function (req, res) {
  const emptyCheck = await Item.find();

  if (emptyCheck.length == 0) {
    await Item.insertMany(defaultItems);
  }

  const foundItems = await Item.find();

  res.render("partials/list.ejs", { page: "Today", list: foundItems });
});

app.get("/:customListName", async (req, res) => {
  const listName = _.capitalize(req.params.customListName);
  const emptyCheck = await List.findOne({ name: listName });

  if (emptyCheck) {
    res.render("partials/list.ejs", { page: listName, list: emptyCheck.items });
  } else {
    const list = new List({
      name: listName,
      items: defaultItems,
    });
    list.save();
    res.render("partials/list.ejs", { page: listName, list: list.items });
  }
});

app.post("/", async function (req, res) {
  const itemName = req.body.item;
  const listName = req.body.list;

  const newItem = new Item({
    title: itemName,
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then((foundList) => {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/delete", async (req, res) => {
  const toDelete = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    await Item.findByIdAndRemove(toDelete);
    res.redirect("/");
  } else {
    await List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: toDelete } } }
    );
    res.redirect("/" + listName);
  }
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
