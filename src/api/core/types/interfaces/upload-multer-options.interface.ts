export interface IUploadMulterOptions {
  storage: any;
  limits: { fileSize: number };
  fileFilter: (req, file, next) => void
}