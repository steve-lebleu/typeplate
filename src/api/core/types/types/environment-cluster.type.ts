import { DatabaseEngine, MomentUnit } from '@types';

type EnvAccessToken = { DURATION: number, SECRET: string, UNIT: MomentUnit };
type EnvOauth = { KEY: string, IS_ACTIVE: boolean, ID: string, SECRET: string, CALLBACK_URL: string };
type EnvMemoryCache = { IS_ACTIVE: boolean, DURATION: number };
type EnvSSL = { IS_ACTIVE: boolean, CERT: string, KEY: string };
type EnvTypeorm = { DB: string, NAME: string, TYPE: DatabaseEngine, HOST: string, PORT: number, PWD: string, USER: string, SYNC: boolean, LOG: boolean, CACHE: boolean, ENTITIES: string, MIGRATIONS: string, SUBSCRIBERS: string };
type EnvLog = { PATH: string, TOKEN: string };
type EnvUpload = { MAX_FILE_SIZE: number, MAX_FILES: number, PATH: string, WILDCARDS: string[] };
type EnvImageScaling = { IS_ACTIVE: boolean, PATH_MASTER: string, PATH_SCALE: string, SIZES: { XS: number, SM: number, MD: number, LG: number, XL: number } };
type EnvRefreshToken = { DURATION: number, UNIT: MomentUnit };

export { EnvAccessToken, EnvOauth, EnvMemoryCache, EnvSSL, EnvTypeorm, EnvLog, EnvUpload, EnvImageScaling, EnvRefreshToken }