const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx'];

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  console.log(`Filtering file: ${file.originalname}`);
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.originalname.split('.').pop() || '';

  if (allowedExtensions.includes(fileExtension)) return callback(null, true);

  callback(null, false);
};
