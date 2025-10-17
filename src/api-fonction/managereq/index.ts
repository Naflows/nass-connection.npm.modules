require('dotenv').config();
import axios from 'axios';
import express, { Request, Response } from 'express';
import { loadTokenFromDisk } from '../../secure/save-token';


function getCookieValue(cookies: string, name: string): string | null {
    const match = cookies.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
    return match ? match[1] : null;
}

function sendCookies(res: Response, data: any) {
    const token = data.data.middleware.token;
    const session = data.data.middleware.session;
    const uid = data.data.middleware.user_id;
    console.log("Setting cookies:", { token, session, uid });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie("session", session, { httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie("uid", uid, { httpOnly: true, secure: true, sameSite: 'none' });
}

function getCookies(req : Request): { sessionID: string | null; token: string | null; uid: string | null } {
    const cookies = req.headers.cookie || '';
    const sessionID = getCookieValue(cookies, 'session');
    const token = getCookieValue(cookies, 'token');
    const uid = getCookieValue(cookies, 'uid');
    console.log("'\x1b[33m%s\x1b[0m'", "Cookies received: " + JSON.stringify({ sessionID, token, uid }));

    return { sessionID, token, uid };
}



async function managereq(req: Request, res: Response, service_id: string, service_key : string, route: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any): Promise<boolean> {
    // Warning: users must have set a tunnel before using this function.
    // This function will use the tunnel to forward the request to the target Naflows API endpoint and ensure the connection of the user is secure and valid.

    if (!service_id || !service_key) throw new Error('Service ID and key must be provided.');
    if (!route || !method) throw new Error('Route and method must be provided.');

    const serviceToken = loadTokenFromDisk(service_key);


    const { sessionID, token, uid } = getCookies(req);

    await axios.post(`${process.env.NAFLOWS_NASS_URL}${route}`, {
        user: {
            ip: req.ip,
            agent: req.headers['user-agent'],
            device_fingerprint: req.fingerprint,
            session_id: sessionID || null,
            token: token || null,
            user_id: uid || null,
        },
        ...body,
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            request_date: Date.now()
        },
        client: {
            service: service_id,
            token: serviceToken?.token || null,
            tokenBirth: serviceToken?.tokenBirth || null
        }
    }).then((result) => {
        const resultData = result.data.data;
        sendCookies(res, result.data);
        delete resultData.middleware;
        return result.status === 200;
    }).catch((error) => {
        console.error("Error creating rights:", error.response ? error.response.data : error.message);
        sendCookies(res, error.response.data);
        delete error.response.data.middleware;
        return false;
    });

    return true;

}

export { managereq };