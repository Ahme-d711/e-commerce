// Type declaration for Express Multer File
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  stream?: NodeJS.ReadableStream;
}

export namespace Express {
  export namespace Multer {
    export interface File extends MulterFile {}
  }
}
