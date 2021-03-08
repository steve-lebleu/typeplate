import { list } from '@utils/enum.util';

/**
 * @description Define application supported mimes
 */
enum CONTENT_MIME_TYPE {
  'application/json' = 'application/json',
  'multipart/form-data' = 'multipart/form-data'
}

type CONTENT_TYPE = 'application/json' | 'multipart/form-data';

/**
 * @description Define supported archives mime-types
 */
enum ARCHIVE_MIME_TYPE {
  'application/x-7z-compressed' = 'application/x-7z-compressed',
  'application/x-rar-compressed' = 'application/x-rar-compressed',
  'application/x-tar' = 'application/x-tar',
  'application/zip' = 'application/zip',
}

type ARCHIVE = 'application/x-7z-compressed' | 'application/x-rar-compressed' | 'application/x-tar' | 'application/zip';

/**
 * @description Define supported audio  mime-types
 */
enum AUDIO_MIME_TYPE {
  'audio/mpeg' = 'audio/mpeg',
  'audio/mid' = 'audio/mid',
  'audio/mp4' = 'audio/mp4',
  'audio/x-aiff' = 'audio/x-aiff',
  'audio/ogg' = 'audio/ogg',
  'audio/vorbis' = 'audio/vorbis',
  'audio/vnd.wav' = 'audio/vnd.wav',
}

type AUDIO = 'audio/mpeg' | 'audio/mid' | 'audio/mp4' | 'audio/x-aiff' | 'audio/ogg' | 'audio/vorbis' | 'audio/vnd.wav';

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

type DOCUMENT = 'application/vnd.ms-excel' | 'application/vnd.ms-powerpoint' | 'application/msword' | 'application/pdf' | 'application/vnd.oasis.opendocument.presentation' | 'application/vnd.oasis.opendocument.spreadsheet' | 'application/vnd.oasis.opendocument.text' | 'text/csv';

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

type IMAGE = 'image/bmp' | 'image/gif' | 'image/jpg' | 'image/jpeg' | 'image/png';

/**
 * @description Define supported video mime-types
 */
enum VIDEO_MIME_TYPE {
  'video/mp4' = 'video/mp4',
  'application/x-mpegURL' = 'application/x-mpegURL',
  'video/3gpp' = 'video/3gpp',
  'video/quicktime' = 'video/quicktime',
  'video/x-msvideo' = 'video/x-msvideo',
  'video/x-ms-wmv' = 'video/x-ms-wmv'
}

type VIDEO = 'video/mp4' | 'application/x-mpegURL' | 'video/3gpp' | 'video/quicktime' | 'video/x-msvideo' | 'video/x-ms-wmv';

/**
 * @description Shortcut for all mime-types
 */
 type MIME_TYPE = AUDIO | ARCHIVE | DOCUMENT | IMAGE | VIDEO;

/**
 * @description Shortcut all media types mime-types as pseudo enum
 */
const MIME_TYPE_ENUM = { ...AUDIO_MIME_TYPE, ...ARCHIVE_MIME_TYPE, ...DOCUMENT_MIME_TYPE, ...IMAGE_MIME_TYPE, ...VIDEO_MIME_TYPE };

/**
 * @description Shortcut all media types mime-types as pseudo enum
 */
 const MIME_TYPE_LIST = [].concat( ...[ AUDIO_MIME_TYPE, ARCHIVE_MIME_TYPE, DOCUMENT_MIME_TYPE, IMAGE_MIME_TYPE, VIDEO_MIME_TYPE ].map( type => list(type) ) );

export {
  CONTENT_MIME_TYPE,
  CONTENT_TYPE,
  ARCHIVE_MIME_TYPE,
  ARCHIVE,
  AUDIO_MIME_TYPE,
  AUDIO,
  DOCUMENT_MIME_TYPE,
  DOCUMENT,
  IMAGE_MIME_TYPE,
  IMAGE,
  VIDEO_MIME_TYPE,
  VIDEO,
  MIME_TYPE,
  MIME_TYPE_ENUM,
  MIME_TYPE_LIST
}
