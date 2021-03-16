
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

//Load Data and products for pseudo database
const Data = require("../data/data.json").data;
//Get all Data
app.get("/", (req, res) => {
  res.json(Data)
});
//Get Data by ID
app.get("/:id", (req, res) =>
  res.json(Data.find(data => data.id === req.params.id))
);
//Start the server
app.listen(port, () => console.log(`listening on port ${port}!`));
