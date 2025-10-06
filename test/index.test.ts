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


const key = "11e7276fd5d2b0d8c046f369e089030a51441e2dfbe380fabae1424add25b4db";
const id = "0008702c-9aa1-49fe-8a45-9aa4c5f656a91759728286498";


// ###################################################################################### //

describe("Initialize Instance", () => {

    it('should fail to initialize from an existing invalid token', async () => {
        await expect(nass.initNaflowsInstance(BefKey, BefID)).rejects.toThrow('Failed to initialize Naflows instance: Error: Token invalid.');
    });


    it('should initialize the Naflows instance successfully', async () => {
        const result = await nass.initNaflowsInstance(key, id, true);
        expect(result).toStrictEqual({ success: true, way: 'network'});
    });

    it('should fail to initialize with invalid credentials', async () => {
        await expect(nass.initNaflowsInstance('invalid_key', 'invalid_id',true)).rejects.toThrow('Failed to initialize Naflows instance');
    });

    it('should initialize the Naflows instance again (with cached token)', async () => {
        const result = await nass.initNaflowsInstance(key, id);
        expect(result).toStrictEqual({ success: true, way: 'cache' });
    });
})

