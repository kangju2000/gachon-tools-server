const express = require("express");
const Snapshot = require("../models/snapshot");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { universityId, url, path, html, courseId } = req.body;
    const snapshot = await Snapshot.create(
      universityId,
      url,
      path,
      html,
      courseId
    );
    res.status(201).json(snapshot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { universityId, path, courseId } = req.query;
    if (!universityId) {
      return res.status(400).json({ error: "University ID is required" });
    }
    const snapshots = await Snapshot.findAll(universityId, path, courseId);
    res.json(snapshots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const snapshot = await Snapshot.findById(req.params.id);
    if (snapshot) {
      res.json(snapshot);
    } else {
      res.status(404).json({ error: "Snapshot not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
