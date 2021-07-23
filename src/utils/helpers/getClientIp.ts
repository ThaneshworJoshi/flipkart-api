import { Request } from 'express';

export const getClientIp = (req: Request) => {
  if (req.headers['x-forwarded-for']) {
    // try to get from x-forwared-for if it set (behind reverse proxy)
    return req.headers['x-forwarded-for'];
  } else if (req.connection && req.connection.remoteAddress) {
    // no proxy, try getting from connection.remoteAddress
    return req.connection.remoteAddress;
  } else if (req.socket) {
    // try to get it from req.socket
    return req.socket.remoteAddress;
  } else {
    // if non above, fallback.
    return req.ip;
  }
};
