import { Router } from "express";
import PinsRouter from './pins-router.js'
import AuthRouter from './auth-router.js'

export class AppRouter {
    static get routes(){
        const router = Router();

        router.use("/pins",PinsRouter)
        router.use("/auth",AuthRouter)

        return router;
    }
}
