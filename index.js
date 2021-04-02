const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbc8q.mongodb.net/assignment-10?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("assignment-10").collection("products");
  const orderCollection = client.db("assignment-10").collection("orders");

  // perform actions on the collection object
  //   start of addProduct
  app.post("/addProduct", (req, res) => {
    console.log(req.body);
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });
  //   end of addProduct

  //   start of allProducts

  app.get("/allProducts", (req, res) => {
    productCollection.find().toArray((err, documents) => {
      console.log(documents);
      res.send(documents);
    });
  });
  //   end of allProducts

  //   start of singleProduct
  app.get("/product/:id", (req, res) => {
    console.log(req.params.id);
    const newId = req.params;
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, item) => {
        console.log(item[0]);
        res.send(item[0]);
      });
    console.log(newId);

    // db.test.find({ _id: ObjectId("4ecc05e55dd98a436ddcc47c") });
  });
  //   end of singleProduct

  //   start of checkOutProduct
  app.post("/orderPlace", (req, res) => {
    console.log(req.body);
    orderCollection.insertOne(req.body).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });
  //   end of checkOutProduct

  //   start of userOrder
  app.get("/email/:userEmail", (req, res) => {
    console.log(req.params.userEmail);
    const findEmail = req.params.userEmail;
    orderCollection.find({ email: findEmail }).toArray((err, orders) => {
      console.log(orders);
      res.send(orders);
    });
  });
  //   end of userOrder
  //   start of allOrders
  // app.get("/all/orders", (req, res) => {
  //   orderCollection.find().toArray((err, items) => {
  //     res.send(items);
  //   });
  // });
  //   end of allOrders
  //   start of deleteOrder
  app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    const orderDelete = req.params.id;
    productCollection
      .deleteOne({ _id: ObjectId(orderDelete) })
      .then((result) => res.send(result.deletedCount > 0));
  });
  //   end of deleteOrder

  console.log("database connected");
});

app.get("/", (req, res) => {
  res.send("Alhamdulillah");
});

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
