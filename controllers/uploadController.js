import path from 'path';

// 🔹 Handle Image Upload
export const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join('/uploads', req.file.filename); // Path where the file is stored
    res.status(200).json({
        message: 'File uploaded successfully',
        fileUrl: filePath,
    });
};
