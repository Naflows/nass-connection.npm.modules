import { nass } from '../src/index';
import { saveTokenToDisk } from '../src/secure/save-token';

// ###################################################################################### //
// Initialize environment for tests:
const BefKey = "326d7e8ada5d119e76ade2bf1103b19e2f0988cac413a1e1523e24d4b2874bd2";
const BefID = "39f286af-d51a-4723-b790-6dc46036e8b31759727523004";

function generateTokenFile() {
    saveTokenToDisk({
        apiId: BefID,
        token: "invalid_token_for_test",
        tokenBirth: Date.now()
    }, BefKey);
}
generateTokenFile();


const key = "da36e512610b00390ca00d9e64ee2f2dbafa541030de478f71d5de4dd8b7b205";
const id = "1bd319b6-5933-4b6a-84ec-c210915ba3cf1760259388936";
const devKey = "0c2baa736b31b7bd5f04d2b970a3156d7636c06dd8f4603f8285d41acc6d2885";


// ###################################################################################### //

describe("Initialize Instance", () => {

    it('should fail to initialize from an existing invalid token', async () => {
        await expect(nass.initNaflowsInstance(BefKey, BefID, devKey)).rejects.toThrow('Failed to initialize Naflows instance: Error: Token invalid.');
    });


    it('should initialize the Naflows instance successfully', async () => {
        const result = await nass.initNaflowsInstance(key, id, devKey, true);
        expect(result).toStrictEqual({ success: true, way: 'network'});
    });

    it('should fail to initialize with invalid credentials', async () => {
        await expect(nass.initNaflowsInstance('invalid_key', 'invalid_id', devKey, true)).rejects.toThrow('Failed to initialize Naflows instance');
    });

    it('should initialize the Naflows instance again (with cached token)', async () => {
        const result = await nass.initNaflowsInstance(key, id, devKey, false);
        expect(result).toStrictEqual({ success: true, way: 'cache' });
    });
})



describe("Instance tunnel creation", () => {
    it('should create a tunnel successfully', async () => {
        const result = await nass.tunnel.create(id, key, devKey, "/user/login", ["auth"]);
        expect(result).toStrictEqual({ success: true, message: "Tunnel created successfully." });
    });

    it("shouldn't create the same tunnel twice", async () => {
        const result = await nass.tunnel.create(id, key, devKey, "/user/login", ["auth"]);
        expect(result).toStrictEqual({ success: false, message: "A tunnel already exists for this target URL." });
    });

    it("shouldn't create a tunnel with invalid credentials", async () => {
        const result = await nass.tunnel.create("invalid_id", "invalid_key", devKey, "/user/login", ["auth"]);
        expect(result).toStrictEqual({ success: false, message: 'User is not a developer for this service.' });
    });
    
    it("shouldn't create a tunnel with a non-existing right", async () => {
        const result = await nass.tunnel.create(id, key, devKey, "/user/login/test", ["non_existing_right"]);
        expect(result).toStrictEqual({ success: false, message: 'Right "non_existing_right" does not exist.' });
    });
});
