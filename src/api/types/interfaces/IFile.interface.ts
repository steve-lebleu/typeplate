export interface IFile {
  path: string;
  filename: string;
  size: number;
  owner?: number;
  destination: string;
  mimetype: string;
  originalname?: string;
}