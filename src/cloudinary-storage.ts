import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    public_id: (req, file) => `uploads/${Date.now()}-${file.originalname}`,
  },
});
