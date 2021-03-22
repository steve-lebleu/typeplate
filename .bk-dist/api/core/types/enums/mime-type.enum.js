"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIME_TYPE_LIST = exports.MIME_TYPE = void 0;
const enum_util_1 = require("@utils/enum.util");
const _enums_1 = require("@enums");
/**
 * @description Shortcut all media types mime-types as pseudo enum
 */
const MIME_TYPE = { ..._enums_1.AUDIO_MIME_TYPE, ..._enums_1.ARCHIVE_MIME_TYPE, ..._enums_1.DOCUMENT_MIME_TYPE, ..._enums_1.IMAGE_MIME_TYPE, ..._enums_1.VIDEO_MIME_TYPE };
exports.MIME_TYPE = MIME_TYPE;
/**
 * @description Shortcut all media types mime-types as pseudo enum
 */
const MIME_TYPE_LIST = [].concat(...[_enums_1.AUDIO_MIME_TYPE, _enums_1.ARCHIVE_MIME_TYPE, _enums_1.DOCUMENT_MIME_TYPE, _enums_1.IMAGE_MIME_TYPE, _enums_1.VIDEO_MIME_TYPE].map(type => enum_util_1.list(type)));
exports.MIME_TYPE_LIST = MIME_TYPE_LIST;
