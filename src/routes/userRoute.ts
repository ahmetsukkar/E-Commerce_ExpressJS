import express from 'express';
import { login, register } from '../services/userService';

const router = express.Router();

router.post('/register', async (req, res) => {
    var { firstName, lastName, email, password } = req.body;
    var result = await register({ firstName, lastName, email, password });
    res.status(result.statusCode).send(result.data);
});

router.post('/login', async (req, res) => {
    var {email, password} = req.body;
    var result = await login({ email, password } );
    res.status(result.statusCode).send(result.data);
});

export default router;