import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY, true);

export const FILE_KEY = 'fileResponse';
export const FileResponse = () => SetMetadata(FILE_KEY, true);
