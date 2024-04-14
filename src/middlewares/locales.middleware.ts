import { Request, Response, NextFunction } from 'express';
import { APP_LOCALES, Locales } from 'src/common/constants/global.const';
import * as i18n from 'i18n';

export const setLocal = (req: Request, res: Response, next: NextFunction) => {
  const locale = APP_LOCALES.includes(req.header('Accept-Language') as Locales)
    ? req.header('Accept-Language')
    : Locales.VI;
  i18n.setLocale(locale);
  return next();
};
