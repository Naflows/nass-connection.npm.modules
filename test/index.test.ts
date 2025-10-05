import { nass } from '../src/index';

describe("Initialize Instance", () => {
    it('should initialize the Naflows instance successfully', async () => {
        const result = await nass.initNaflowsInstance('d1e7e37070fe270f1ad0a92ada88cc3091bac64a00b95f4b238b031e84ce4ef1', '49254de4-f37d-45c8-8c64-50701f7b92bc1759653039636', true);
        expect(result).toStrictEqual({ success: true, way: 'network'});
    });

    it('should fail to initialize with invalid credentials', async () => {
        await expect(nass.initNaflowsInstance('invalid_key', 'invalid_id',true)).rejects.toThrow('Failed to initialize Naflows instance');
    });

    it('should initialize the Naflows instance again (with cached token)', async () => {
        const result = await nass.initNaflowsInstance('d1e7e37070fe270f1ad0a92ada88cc3091bac64a00b95f4b238b031e84ce4ef1', '49254de4-f37d-45c8-8c64-50701f7b92bc1759653039636', false);
        expect(result).toStrictEqual({ success: true, way: 'cache' });
    });
})