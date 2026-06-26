import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GuestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies || !req.cookies.guestId) {
      const guestId = uuidv4();

      res.cookie('guestId', guestId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      req['guestId'] = guestId;
    } else {
      req['guestId'] = req.cookies.guestId;
    }
    next();
  }
}
