import multer from 'multer';

const multerConfig: multer.Options = {
    storage: multer.memoryStorage()
}

export default multerConfig;