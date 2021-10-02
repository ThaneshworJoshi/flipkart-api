import { Request } from 'express';
import { UserDocument } from '../../models/user.model';

export interface AuthenticatedRequest extends Request {
  currentUser?: UserDocument;
}
