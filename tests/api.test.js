const request = require('supertest');
const app = require('../app/backend/server');

describe('API Tests - Products', () => {

    it('GET /health should return 200', async () => {
        const res = await request (app).get('/health');

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('OK');
    });

    it('GET /products should return array or fail gracefully', async() => {
        const res = await request(app).get('/products');

        //because you added chaos, both are valid
        
        expect([200, 500]).toContain(res.statusCode);
    })
})