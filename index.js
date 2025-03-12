require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// *MongoDB URI connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lhej2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// *Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    // *Get The Database and collections
    const database = client.db(process.env.DB_NAME);
    const movieCollection = database.collection("movie");
    const blogCollection = database.collection("blogs");
    const favoriteCollection = database.collection("favorites");

    // *Movie Routes
    // *Get All Movies
    app.get("/movies", async (req, res) => {
      const cursor = movieCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // *Get Featured Movies (top 6 by rating)
    app.get("/movies/featured", async (req, res) => {
      const cursor = movieCollection.find().sort({ Rating: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // *Get a Single Movie
    app.get("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);
      res.send(result);
    });

    // *Add a Movie
    app.post("/movies", async (req, res) => {
      const movie = req.body;
      const result = await movieCollection.insertOne(movie);
      res.send(result);
    });

    // *Update a Movie
    app.put("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const updatedMovie = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: false };
      const updateDoc = {
        $set: updatedMovie,
      };
      const result = await movieCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // *Delete a Movie
    app.delete("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.deleteOne(query);
      res.send(result);
    });

    // *Favorite Routes
    // *Get All Favorites
    app.get("/favorites", async (req, res) => {
      const cursor = favoriteCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // *Get a Single Favorite Movie
    app.get("/favorites/:movieId", async (req, res) => {
      const movieId = req.params.movieId;
      const query = { movieId: movieId };
      const result = await favoriteCollection.findOne(query);
      res.send(result);
    });

    // *Add To Favorites
    app.post("/favorites", async (req, res) => {
      const favorite = req.body;
      const result = await favoriteCollection.insertOne(favorite);
      res.send(result);
    });

    // *Remove From Favorites
    app.delete("/favorites/:id", async (req, res) => {
      const id = req.params.id;
      const query = { movieId: id };
      const result = await favoriteCollection.deleteOne(query);
      res.send(result);
    });

    // *Blog Routes
    // *Get All Blogs
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // *Get a Single Blog
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is the server of CineSphere");
});

app.listen(port, () => {
  console.log(`Movie server is running in port : ${port}`);
});
