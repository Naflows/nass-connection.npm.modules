
// Used by developers ONLY for developement purposes.
// DO NOT USE IN PRODUCTION AS IT POSES A SECURITY RISK.

import axios from "axios";

export async function passThrough(apiID : string, developer_access_key : string) : Promise<{ success: boolean; message: string }> {
    try {
        const response = await axios.post(`${process.env.NAFLOWS_NASS_URL}/nass/dev/instance/tunnel/create`, {
            service_id : apiID,
            developer_access_key
        }).catch((err) => {
            throw new Error("Invalid developer access key or service ID.");
        });
        return { success: response.data.success, message: response.data.message };
    } catch (error) {
        throw new Error('Failed to pass through: ' + error);
    }
}