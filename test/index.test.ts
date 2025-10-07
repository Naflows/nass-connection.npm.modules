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


const key = "94e8be0ba869a144a8f8ca77c2297ed37aca6b349a7628dd3e53e967a30ef072";
const id = "3933bd09-2277-41e4-ad1d-32c52c1ab5821759817021385";
const devKey = "19381678f6c6d8dde36d8b8fc45554568fb2c4d644c66cacb5187f13eab1b18c";


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



describe("Instance pass-through", () => {
    it('should pass-through successfully', async () => {
        const result = await nass.tunnel.create(id, devKey);
        expect(result).toStrictEqual({ success: true, message: 'Not implemented yet.' });
    });

    it('should fail to pass-through with invalid developer key', async () => {
        await expect(nass.tunnel.create(id, 'invalid_dev_key')).rejects.toThrow('Failed to pass through: Error: Invalid developer access key or service ID.');
    });

    it('should fail to pass-through with invalid user ID', async () => {
        await expect(nass.tunnel.create('invalid_user_id', devKey)).rejects.toThrow('Failed to pass through: Error: Invalid developer access key or service ID.');
    });
});
