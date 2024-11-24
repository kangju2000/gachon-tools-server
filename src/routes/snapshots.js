const express = require("express");
const Snapshot = require("../models/snapshot");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { universityId, url, snapshots } = req.body;
    if (!universityId || !url || !Array.isArray(snapshots)) {
      return res
        .status(400)
        .json({ error: "Missing required fields or invalid data format" });
    }

    for (const item of snapshots) {
      const { path, html, courseId } = item;
      if (!path || !html || !courseId) {
        return res
          .status(400)
          .json({ error: "Missing required fields in data array" });
      }
    }

    const snapshot = await Snapshot.create(universityId, url, snapshots);
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
