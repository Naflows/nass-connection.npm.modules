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


const key = "54b4ad5fb7fbd7097acc178c3bf76dbd3844dfc0fb2ebfb44783048d3cd9ffc9";
const id = "852ec397-10d1-4d38-83a7-0e2ef75257211759732749468";
const devKey = "7cd086e719b4bd51859e6b4017b6c6e87588217fabf1504dcd23aaea0b6374b2";


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
