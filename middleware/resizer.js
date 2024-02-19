const resizeAndSaveImage = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        try {
            const { buffer } = await sharp(req.file.buffer)
                .resize({ width: 300 }) // Set the width as needed
                .toBuffer();

            req.file.buffer = buffer; // Replace the original buffer with the resized one

            next(); // Proceed to the next middleware
        } catch (error) {
            console.error('Error resizing image:', error);
            return res.status(500).json({ error: 'An error occurred while resizing the image' });
        }
    });
};

module.exports = resizeAndSaveImage;