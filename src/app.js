const express = require("express");
const cors = require("cors");
const logger = require("./logger");
const snapshotRoutes = require("./routes/snapshots");

const app = express();
const port = process.env.PORT || 8080;

const allowedOrigins = [
  "http://localhost:5173",
  "https://cyber.gachon.ac.kr", // 가천대학교 LMS
  "https://eclass.uos.ac.kr", // 서울시립대학교 LMS
];

app.use(
  cors({
    origin: function (origin, callback) {
      // origin이 undefined인 경우는 같은 출처의 요청임 (예: Postman, curl 등)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use("/api/snapshots", snapshotRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
