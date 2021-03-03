/**
 * @description Define common mime-types
 */
enum MIME_TYPE {
  'application/octet-stream' = 'application/octet-stream', // Archive, binary
  'application/vnd.ms-excel' = 'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint' = 'application/vnd.ms-powerpoint',
  'application/msword' = 'application/msword',
  'application/pdf' = 'application/pdf',
  'application/vnd.oasis.opendocument.presentation' = 'application/vnd.oasis.opendocument.presentation',
  'application/vnd.oasis.opendocument.spreadsheet' = 'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.oasis.opendocument.text' = 'application/vnd.oasis.opendocument.text',
  'application/x-7z-compressed' = 'application/x-7z-compressed',
  'application/x-rar-compressed' = 'application/x-rar-compressed',
  'application/x-tar' = 'application/x-tar',
  'application/zip' = 'application/zip',
  'image/bmp' = 'image/bmp',
  'image/gif' = 'image/gif',
  'image/jpg' = 'image/jpg',
  'image/jpeg' = 'image/jpeg',
  'image/png' = 'image/png',
  'text/calendar' = 'text/calendar',
  'text/csv' = 'text/csv',
  'text/html' = 'text/html',
  'text/plain' = 'text/plain',
}

/**
 * @description Define supported image mime-types
 */
enum IMAGE_MIME_TYPE {
  'image/bmp' = 'image/bmp',
  'image/gif' = 'image/gif',
  'image/jpg' = 'image/jpg',
  'image/jpeg' = 'image/jpeg',
  'image/png' = 'image/png'
}

/**
 * @description Define supported archives mime-types
 */
enum ARCHIVE_MIME_TYPE {
  'application/x-7z-compressed' = 'application/x-7z-compressed',
  'application/x-rar-compressed' = 'application/x-rar-compressed',
  'application/x-tar' = 'application/x-tar',
  'application/zip' = 'application/zip',
}

/**
 * @description Define supported documents mime-types
 */
enum DOCUMENT_MIME_TYPE {
  'application/vnd.ms-excel' = 'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint' = 'application/vnd.ms-powerpoint',
  'application/msword' = 'application/msword',
  'application/pdf' = 'application/pdf',
  'application/vnd.oasis.opendocument.presentation' = 'application/vnd.oasis.opendocument.presentation',
  'application/vnd.oasis.opendocument.spreadsheet' = 'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.oasis.opendocument.text' = 'application/vnd.oasis.opendocument.text',
  'text/csv' = 'text/csv'
}

/**
 * @description Define application supported mimes
 */
enum APPLICATION_MIME_TYPE {
  'application/json' = 'application/json',
  'application/vnd.api+json' = 'application/vnd.api+json',
  'multipart/form-data' = 'multipart/form-data'
}

/**
 * @description Define upload allowed mime-types
 */
enum UPLOAD_MIME_TYPE {
  'application/vnd.ms-excel' = 'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint' = 'application/vnd.ms-powerpoint',
  'application/msword' = 'application/msword',
  'application/pdf' = 'application/pdf',
  'application/vnd.oasis.opendocument.presentation' = 'application/vnd.oasis.opendocument.presentation',
  'application/vnd.oasis.opendocument.spreadsheet' = 'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.oasis.opendocument.text' = 'application/vnd.oasis.opendocument.text',
  'application/x-7z-compressed' = 'application/x-7z-compressed',
  'application/x-rar-compressed' = 'application/x-rar-compressed',
  'application/x-tar' = 'application/x-tar',
  'application/zip' = 'application/zip',
  'image/bmp' = 'image/bmp',
  'image/gif' = 'image/gif',
  'image/jpg' = 'image/jpg',
  'image/jpeg' = 'image/jpeg',
  'image/png' = 'image/png',
  'text/csv' = 'text/csv'
}

// TODO: sortir ce type d'ici
type TYPE = 'application/vnd.ms-excel' | 'application/vnd.ms-powerpoint' | 'application/msword' | 'application/pdf' | 'application/vnd.oasis.opendocument.presentation' | 'application/vnd.oasis.opendocument.spreadsheet' | 'application/vnd.oasis.opendocument.text' | 'application/x-7z-compressed' | 'application/x-rar-compressed' | 'application/x-tar' | 'application/zip' | 'image/bmp' | 'image/gif' | 'image/jpg' | 'image/jpeg'| 'image/png' | 'text/csv';

export { MIME_TYPE, IMAGE_MIME_TYPE, ARCHIVE_MIME_TYPE, DOCUMENT_MIME_TYPE, APPLICATION_MIME_TYPE, UPLOAD_MIME_TYPE, TYPE }