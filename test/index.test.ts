import { managereq } from '../src/api-fonction/managereq';
import { nass } from '../src/index';
import { saveTokenToDisk } from '../src/secure/save-token';
import { describe, it, expect } from '@jest/globals';

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


const key = "a54254f8981326820c8973205e2f67f9045097ad34542fb6501ffc09cc38f863";
const id = "c474c5aa-b11d-4da5-ad93-f0501edae5f71762964764337";
const devKey = "b56f2051dc90dc42cccef4d1c9f34333959c65b2456c4c0b177a753517e205e9";


// ###################################################################################### //

describe("Initialize Instance", () => {

    it('should fail to initialize from an existing invalid token', async () => {
        await expect(nass.initNaflowsInstance(BefKey, BefID, devKey)).rejects.toThrow('Failed to initialize Naflows instance: Error: Token invalid.');
    });


    it('should initialize the Naflows instance successfully', async () => {
        const result = await nass.initNaflowsInstance(key, id, devKey, true);
        expect(result).toStrictEqual({ success: true, way: 'network' });
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


describe("Tunneling", () => {
    // Init 
    saveTokenToDisk({
        apiId: "naflows_backend",
        token: "naflows_backend_token",
        tokenBirth: 1758844800000
    }, "naflows_backend_key");

    it("should forward a request through the tunnel successfully", async () => {

    })
})