import { list } from '@utils/enum.util';

import { AUDIO_MIME_TYPE, ARCHIVE_MIME_TYPE, DOCUMENT_MIME_TYPE, IMAGE_MIME_TYPE, VIDEO_MIME_TYPE } from '@enums';

/**
 * @description Shortcut all media types mime-types as pseudo enum
 */
const MIME_TYPE = { ...AUDIO_MIME_TYPE, ...ARCHIVE_MIME_TYPE, ...DOCUMENT_MIME_TYPE, ...IMAGE_MIME_TYPE, ...VIDEO_MIME_TYPE };

/**
 * @description Shortcut all media types mime-types as pseudo enum
 */
const MIME_TYPE_LIST = [].concat( ...[ AUDIO_MIME_TYPE, ARCHIVE_MIME_TYPE, DOCUMENT_MIME_TYPE, IMAGE_MIME_TYPE, VIDEO_MIME_TYPE ].map( type => list(type) ) );

export {
  MIME_TYPE,
  MIME_TYPE_LIST
}
