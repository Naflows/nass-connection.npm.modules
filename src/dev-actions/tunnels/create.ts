import axios, { AxiosError } from "axios";

export async function createTunnel(apiID: string, apiKey: string, developer_access_key: string, route: string, service_rights: string[]): Promise<{ success: boolean; message: string }> {
    try {
        const res = await axios.post(`${process.env.NAFLOWS_NASS_URL}/nass/dev/instance/tunnel/create`, {
            apiID: apiID,
            apiKey: apiKey,
            devKey: developer_access_key,
            route,
            service_rights
        });
        if (res.status !== 201) throw new Error(res.data.message);
        return { success: true, message: res.data.message };
    } catch (err) {
        let errorMessage = "Unknown error occurred.";
        if (axios.isAxiosError(err) && err.response && err.response.data) {
            if (typeof err.response.data === "object" && "message" in err.response.data) {
                errorMessage = (err.response.data as { message: string }).message;
            } else if (typeof err.response.data === "string") {
                errorMessage = err.response.data;
            }
        }
        return { success: false, message: errorMessage };
    }
}