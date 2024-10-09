import { Request, Response,NextFunction } from 'express';

const Joy = require('joi');
const userRule = () => {
    return Joy.object({
        name: Joy.string().alphanum().min(3).max(30).required(),
        email: Joy.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        phone: Joy.string(),
        password: Joy.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
    });
}

const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = userRule().validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export default validateUser;