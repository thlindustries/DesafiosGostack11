import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const pastaTmp = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  diretorio: pastaTmp,
  storage: multer.diskStorage({
    destination: pastaTmp,
    filename(req, file, cb) {
      const arquivoHash = crypto.randomBytes(12).toString('hex');
      const nomeArquivo = `${arquivoHash}-${file.originalname}`;

      return cb(null, nomeArquivo);
    },
  }),
};
