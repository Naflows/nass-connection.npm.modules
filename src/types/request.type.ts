import { NASSSession } from "./session.type";

export interface NassRequest {
    user : {
        ip : string;
        agent : string;
        device_fingerprint : string;
        session_id : string;
        token : string;
        user_id : string;
    },
    request : {
        method : string;
        url : string;
        headers : Record<string, string>;
        request_date : string;
    },
    client : NASSSession;
}
