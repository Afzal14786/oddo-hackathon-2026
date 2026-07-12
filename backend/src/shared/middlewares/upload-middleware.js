import multer from 'multer';
import { AppError } from '../utils/app-error.js';
import { HTTP_STATUS } from '../constants/http-codes.js';

// configure storage 
const storage = multer.memoryStorage();

// file filter – accept only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid file type. Only images and PDFs are allowed.'
      ),
      false
    );
  }
};

// create multer instance with limits
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter,
});

// middleware for single file upload
export const uploadSingle = upload.single('document');

// for multiple files
export const uploadMultiple = upload.array('documents', 5); // max 5 files