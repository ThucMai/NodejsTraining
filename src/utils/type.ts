import { Request } from 'express';

export interface BaseResponse {
    success: boolean;
    data?: object | Array<Object>;
    message?: string;
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
  