require('dotenv').config();
import axios, { AxiosInstance } from 'axios';
import Fingerprint from 'express-fingerprint';
import cookieParser from 'cookie-parser';
import { NASSSession } from './types/session.type';
import { loadTokenFromDisk, saveTokenToDisk } from './secure/save-token';
import fs from 'fs';
import { createTunnel } from './dev-actions/tunnels/create';





// Usage: initNaflowsInstance("your_key", "your_id");
async function initNaflowsInstance(key: string, id: string, devKey: string, viaNetwork: boolean = false): Promise<{
    success: boolean;
    way: 'cache' | 'network';
}> {
    // This function initializes the API instance to Naflows System, and works securely on the fact that the API key is never exposed to the client side and is private.
    // Publicily exposed information is the API ID, which is not sensitive.
    try {
        if (!key || !id) throw new Error('API key and ID must be provided');

        let load;
        try {
            if (!viaNetwork) {
                load = loadTokenFromDisk(key);
            }
        } catch (e) {
            load = null;
        }



        if (load != null) {
            await axios.post(`${process.env.NAFLOWS_NASS_URL}/nass/dev/instance/init-test`, {
                apiID: id,
                token: load?.token,
                tokenBirth: load?.tokenBirth,
                devKey: devKey
            }).then((res) => {
                if (res.status !== 200) throw new Error(res.data.message);
            }, (err) => {
                throw new Error('Token invalid.');
            });
            return { success: true, way: 'cache' };
        } else {
            const response = await axios.post(`${process.env.NAFLOWS_NASS_URL}/nass/dev/instance/init`, {
                apiKey: key,
                apiID: id,
                devKey: devKey
            }).catch((err) => {
                throw new Error(err);
            });
            if (response.status === 200) {
                const { token, token_birth } = response.data.data;
                saveTokenToDisk({ token, tokenBirth: token_birth, apiId: id }, key);
                return { success: true, way: 'network' };
            } else {
                throw new Error('Failed to initialize Naflows instance: ' + response.data.message);
            }
        }

    } catch (error) {
        throw new Error('Failed to initialize Naflows instance: ' + error);
    }
}




export const nass = {
    initNaflowsInstance,
    tunnel : {
        create : createTunnel
    }
}