import { list } from '@utils/enum.util';

/**
 * @description Define application supported mimes
 */
enum APPLICATION_MIME_TYPE {
  'application/json' = 'application/json',
  'application/vnd.api+json' = 'application/vnd.api+json',
  'multipart/form-data' = 'multipart/form-data'
}

type APPLICATION_TYPE = 'application/json' | 'application/vnd.api+json' | 'multipart/form-data';

/**
 * @description Define supported archives mime-types
 */
enum ARCHIVE_MIME_TYPE {
  'application/x-7z-compressed' = 'application/x-7z-compressed',
  'application/x-rar-compressed' = 'application/x-rar-compressed',
  'application/x-tar' = 'application/x-tar',
  'application/zip' = 'application/zip',
}

type ARCHIVE_TYPE = 'application/x-7z-compressed' | 'application/x-rar-compressed' | 'application/x-tar' | 'application/zip';

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

type AUDIO_TYPE = 'audio/mpeg' | 'audio/mid' | 'audio/mp4' | 'audio/x-aiff' | 'audio/ogg' | 'audio/vorbis' | 'audio/vnd.wav';

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

type DOCUMENT_TYPE = 'application/vnd.ms-excel' | 'application/vnd.ms-powerpoint' | 'application/msword' | 'application/pdf' | 'application/vnd.oasis.opendocument.presentation' | 'application/vnd.oasis.opendocument.spreadsheet' | 'application/vnd.oasis.opendocument.text' | 'text/csv';

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

type IMAGE_TYPE = 'image/bmp' | 'image/gif' | 'image/jpg' | 'image/jpeg' | 'image/png';

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

type VIDEO_TYPE = 'video/mp4' | 'application/x-mpegURL' | 'video/3gpp' | 'video/quicktime' | 'video/x-msvideo' | 'video/x-ms-wmv';

const MIME_TYPE = [].concat( ...[ AUDIO_MIME_TYPE, ARCHIVE_MIME_TYPE, DOCUMENT_MIME_TYPE, IMAGE_MIME_TYPE, VIDEO_MIME_TYPE ].map( type => list(type) ) );

export {
  APPLICATION_MIME_TYPE,
  APPLICATION_TYPE,
  ARCHIVE_MIME_TYPE,
  ARCHIVE_TYPE,
  AUDIO_MIME_TYPE,
  AUDIO_TYPE,
  DOCUMENT_MIME_TYPE,
  DOCUMENT_TYPE,
  IMAGE_MIME_TYPE,
  IMAGE_TYPE,
  VIDEO_MIME_TYPE,
  VIDEO_TYPE,
  MIME_TYPE
}