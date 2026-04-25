describe('API E2E Flow', () => {

  it('should check health endpoint', () => {
    cy.request('http://localhost:3000/health')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status).to.eq('OK');
      });
  });

  it('should handle products endpoint (chaos-aware)', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/products',
      failOnStatusCode: false
    }).then((response) => {

      // because system is intentionally unstable
      expect([200, 500]).to.include(response.status);

      if (response.status === 200) {
        expect(response.body).to.be.an('array');
      }
    });
  });

  it('should detect API failure under chaos', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/products?chaos=error',
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(500);
  });
});

it('should detect slow response under latency chaos', () => {
  const start = Date.now();

  cy.request('http://localhost:3000/products?chaos=latency')
    .then((response) => {
      const duration = Date.now() - start;

      expect(duration).to.be.greaterThan(1500);
      expect(response.status).to.eq(200);
    });
});

});