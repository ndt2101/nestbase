export enum Locales {
  VI = 'vi',
  EN = 'en',
  JA = 'ja',
  KR = 'kr',
}

export enum LocalesFullText {
  VI = 'Vietnamese',
  EN = 'English',
  JA = 'Japanese',
  KR = 'Korean',
}

export const APP_LOCALES = [Locales.VI, Locales.EN];

export const LIMIT_RECORD_DEFAULT = 20;
export const PAGE_DEFAULT = 1;

export const CODE_COMMON_FAIL = 500;

export enum ResponseType {
  Ok,
  Created,
}

export enum SORT_DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum DB_CONNECTION {
  DCIM = 'dcim',
  DEFAULT = 'default',
}