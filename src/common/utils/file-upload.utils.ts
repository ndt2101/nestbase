import { extname } from 'path';
import * as fs from 'fs';

export const destination = (req, file, callback) => {
    let newFolderName = req.headers['des_folder'] ? decodeURI(req.headers['des_folder']) : 'it_brain_default'
    if (req.headers["content-length"] > 250 * 1048576) {
        callback(new Error('content-length is invalid'), false);
    }
    if (!fs.existsSync(`${process.cwd()}/public/uploads/applications/${newFolderName}`)){
        fs.mkdirSync(`${process.cwd()}/public/uploads/applications/${newFolderName}`, { recursive: true });
    }
    callback(null, `${process.cwd()}/public/uploads/applications/${newFolderName}`);
};

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|xlsx|doc|docx|xls|pdf|gz|tar|txt|7z|rar|odt|ods|odp|doc|csv|zip)$/)) {
        return callback(new Error('file type is not allowed'), false);
    }
    callback(null, true);
};

export const setFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};