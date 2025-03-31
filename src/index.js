// import dotenv from "dotenv"
// import express from "express"
// const app = express()
// import connectDB from "./db/index.js"
// import urlRoute from "./routes/url.js"
// import { URL } from "./models/url.models.js"
// import cors from "cors"

// dotenv.config()
// app.use(cors)

// console.log("db")
// //connectDB();

// app.use(express.json())
// // app.use("/url", urlRoute)

// app.use("/url", () => {
//   console.log("check")
// })

// app.post("/url", async (req, res) => {
//   res.json("request accepted")
// })
// app.get("/", async (req, res) => {
//   res.json("request accepted")
// })

// app.get('/:shortId', async (req, res) => {
//   const shortId = req.params.shortId;
//   const entry = await URL.findOneAndUpdate({
//     shortId
//   },
//     {
//       $push: {
//         visitHistory: {
//           timestamp: Date.now(),
//         }
//       },
//     });
//   res.redirect(entry.redirectURL);
// })

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })

import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./db/index.js"
import urlRoute from "./routes/url.js"
import { URL } from "./models/url.models.js"

dotenv.config()
const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/ping', (req, res) => {
  res.send('pong')
})
app.use("/url", urlRoute)

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({
    shortId
  },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        }
      },
    });
  res.redirect(entry.redirectURL);
})

app.get("/view/all", async (req, res) => {
  try {
    const urls = await URL.find();
    res.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/find/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;
    const entry = await URL.findOne({ shortId });
    if (!entry) {
      return res.status(404).json({ message: "Shortened URL not found" });
    }
    res.json({ redirectURL: entry.redirectURL });

  } catch (error) {
    console.error("Error fetching URL:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})