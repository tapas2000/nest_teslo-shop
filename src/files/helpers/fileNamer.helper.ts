import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  if (!file) return callback(new Error('File is empty'), '');

  console.log(file.originalname);

  const fileExtension = file.originalname.split('.').pop() || '';

  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
};
