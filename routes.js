const express = require("express");
const multer = require("multer");
const bucket = require("./firebase");
const Image = require("./models/imageschema");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Upload an image to Firebase Storage and MongoDB
router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const file = bucket.file(`uploads/${Date.now()}-${req.file.originalname}`);
        const stream = file.createWriteStream({
            metadata: { contentType: req.file.mimetype },
        });

        stream.on("error", (err) => res.status(500).json({ error: err.message }));

        stream.on("finish", async () => {
            await file.makePublic();
            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

            const newImage = new Image({
                url: imageUrl,
                fileName: file.name,
                category: req.body.category,
            });

            await newImage.save();
            res.json({ message: "Upload successful", url: imageUrl });
        });

        stream.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/replace", upload.single("image"), async (req, res) => {
    try {
        const { oldFileName, category } = req.body;
        if (!req.file || !oldFileName) return res.status(400).json({ error: "Missing data" });

        // Delete old image from Firebase Storage
        await bucket.file(oldFileName).delete();

        // Upload new image
        const newFile = bucket.file(`uploads/${Date.now()}-${req.file.originalname}`);
        const stream = newFile.createWriteStream({ metadata: { contentType: req.file.mimetype } });

        stream.on("finish", async () => {
            await newFile.makePublic();
            const newUrl = `https://storage.googleapis.com/${bucket.name}/${newFile.name}`;

            // Update MongoDB
            await Image.findOneAndUpdate({ fileName: oldFileName }, { url: newUrl, fileName: newFile.name, category });

            res.json({ message: "Image replaced successfully", url: newUrl });
        });

        stream.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

router.get("/get-images", async (req, res) => {
    try {
        const cachedImages = cache.get("images");
        if (cachedImages) return res.json(cachedImages);

        const images = await Image.find();
        cache.set("images", images);
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports=router;