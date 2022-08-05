//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://haibatluong:H0964598830@cluster0.qajr2.mongodb.net/todolistDB"); //{useNewUrl:true}

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

// const doc = await Item.create({name: "some tasks need to be done."})
const item1 = new Item({
  name: "some tasks need to be done."
});

const item2 = new Item({
  name: "some shit need to be done."
});

const item3 = new Item({
  name: "some things need to be done."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  const day = date.getDate();

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Success add item into mongoDB");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });

  // Item.find({}, function(err, foundItems) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(foundItems);
  //     res.render("list", {
  //       listTitle: day,
  //       newListItems: foundItems
  //     });
  //   }
  // })

});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }



});



app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted Item:");
        console.log(docs);
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err,foundList){
      if (!err){
        res.redirect("/" +listName);
      }
    });
  }




})

app.get("/:customListName", function(req, res) {

  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName)
      } else {
        //show an existing list
        // console.log("Exist!");

        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });

      }

      // const customListName = req.params.customListName;
      //
      // const list = new List({
      //   name: customListName,
      //   items: defaultItems
      // });
      //
      // list.save();

    } else {
      console.log(err);
    }
  });

});

// app.get("/work", function(req, res) {
//   res.render("list", {
//     listTitle: "Work List",
//     newListItems: workItems
//   });
// });

app.get("/about", function(req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
