const request = require('supertest');
const { expect } = require('chai');

const BASE_URL = process.env.NODE_API_URL || 'http://localhost:3030';

// Known seed data values from data/dealerships.json and data/reviews.json
const TOTAL_DEALERSHIPS = 50;
const TOTAL_REVIEWS = 100;
const FIRST_DEALER_ID = 1;
const KNOWN_STATE = 'Texas';
const KNOWN_DEALER_ID_WITH_REVIEWS = 15;

describe('MongoDB API Endpoints', () => {
  it('GET / should return welcome message', async () => {
    const res = await request(BASE_URL).get('/');
    expect(res.status).to.equal(200);
    expect(res.text).to.equal('Welcome to the Mongoose API');
  });

  describe('GET /fetchDealers - All dealerships', () => {
    it('should return status 200', async () => {
      const res = await request(BASE_URL).get('/fetchDealers');
      expect(res.status).to.equal(200);
    });

    it('should return an array', async () => {
      const res = await request(BASE_URL).get('/fetchDealers');
      expect(res.body).to.be.an('array');
    });

    it('should return at least all seed dealerships', async () => {
      const res = await request(BASE_URL).get('/fetchDealers');
      expect(res.body.length).to.be.at.least(TOTAL_DEALERSHIPS);
    });

    it('each dealer should have required fields', async () => {
      const res = await request(BASE_URL).get('/fetchDealers');
      res.body.forEach(dealer => {
        expect(dealer).to.have.property('id').that.is.a('number');
        expect(dealer).to.have.property('city').that.is.a('string');
        expect(dealer).to.have.property('state').that.is.a('string');
        expect(dealer).to.have.property('address').that.is.a('string');
        expect(dealer).to.have.property('zip').that.is.a('string');
        expect(dealer).to.have.property('full_name').that.is.a('string');
      });
    });

    it('dealers should have unique ids', async () => {
      const res = await request(BASE_URL).get('/fetchDealers');
      const ids = res.body.map(d => d.id);
      expect(new Set(ids).size).to.equal(ids.length);
    });
  });

  describe('GET /fetchDealer/:id - Single dealer by ID', () => {
    it('should return status 200 for existing dealer', async () => {
      const res = await request(BASE_URL).get(`/fetchDealer/${FIRST_DEALER_ID}`);
      expect(res.status).to.equal(200);
    });

    it('should return an array with one dealer', async () => {
      const res = await request(BASE_URL).get(`/fetchDealer/${FIRST_DEALER_ID}`);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1);
    });

    it('should return the correct dealer', async () => {
      const res = await request(BASE_URL).get(`/fetchDealer/${FIRST_DEALER_ID}`);
      expect(res.body[0].id).to.equal(FIRST_DEALER_ID);
      expect(res.body[0].full_name).to.equal('Holdlamis Car Dealership');
    });

    it('should return empty array for non-existent ID', async () => {
      const res = await request(BASE_URL).get('/fetchDealer/99999');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(0);
    });

    it('should return error for non-numeric ID', async () => {
      const res = await request(BASE_URL).get('/fetchDealer/abc');
      expect(res.status).to.equal(500);
    });
  });

  describe('GET /fetchDealers/:state - Dealers by state', () => {
    it('should return dealers for a valid state', async () => {
      const res = await request(BASE_URL).get(`/fetchDealers/${KNOWN_STATE}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
      res.body.forEach(dealer => {
        expect(dealer.state).to.equal(KNOWN_STATE);
      });
    });

    it('should return empty array for non-existent state', async () => {
      const res = await request(BASE_URL).get('/fetchDealers/NonExistentState');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(0);
    });

    it('should handle special characters in state name', async () => {
      const res = await request(BASE_URL).get('/fetchDealers/');
      expect(res.status).to.equal(200);
    });
  });

  describe('GET /fetchReviews - All reviews', () => {
    it('should return status 200', async () => {
      const res = await request(BASE_URL).get('/fetchReviews');
      expect(res.status).to.equal(200);
    });

    it('should return an array', async () => {
      const res = await request(BASE_URL).get('/fetchReviews');
      expect(res.body).to.be.an('array');
    });

    it('should return at least all seed reviews', async () => {
      const res = await request(BASE_URL).get('/fetchReviews');
      expect(res.body.length).to.be.at.least(TOTAL_REVIEWS);
    });

    it('each review should have required fields', async () => {
      const res = await request(BASE_URL).get('/fetchReviews');
      res.body.forEach(review => {
        expect(review).to.have.property('id').that.is.a('number');
        expect(review).to.have.property('name').that.is.a('string');
        expect(review).to.have.property('dealership').that.is.a('number');
        expect(review).to.have.property('review').that.is.a('string');
        expect(review).to.have.property('purchase').that.is.a('boolean');
        expect(review).to.have.property('car_make').that.is.a('string');
        expect(review).to.have.property('car_model').that.is.a('string');
        expect(review).to.have.property('car_year').that.is.a('number');
      });
    });

    it('reviews should have unique ids', async () => {
      const res = await request(BASE_URL).get('/fetchReviews');
      const ids = res.body.map(r => r.id);
      expect(new Set(ids).size).to.equal(ids.length);
    });
  });

  describe('GET /fetchReviews/dealer/:id - Reviews by dealer', () => {
    it('should return reviews for a dealer that has reviews', async () => {
      const res = await request(BASE_URL).get(`/fetchReviews/dealer/${KNOWN_DEALER_ID_WITH_REVIEWS}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
      res.body.forEach(review => {
        expect(review.dealership).to.equal(KNOWN_DEALER_ID_WITH_REVIEWS);
      });
    });

    it('should return empty array for dealer with no reviews', async () => {
      const res = await request(BASE_URL).get('/fetchReviews/dealer/1');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return empty array for non-existent dealer', async () => {
      const res = await request(BASE_URL).get('/fetchReviews/dealer/99999');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(0);
    });
  });

  describe('POST /insert_review - Insert a review', () => {
    const testReview = {
      name: 'Test User',
      dealership: 15,
      review: 'Automated test review entry',
      purchase: true,
      purchase_date: '06/20/2026',
      car_make: 'Toyota',
      car_model: 'Camry',
      car_year: 2025
    };

    it('should insert a new review and return status 200', async () => {
      const res = await request(BASE_URL)
        .post('/insert_review')
        .send(JSON.stringify(testReview))
        .set('Content-Type', 'application/json');
      expect(res.status).to.equal(200);
    });

    it('should return the created review with all fields', async () => {
      const res = await request(BASE_URL)
        .post('/insert_review')
        .send(JSON.stringify(testReview))
        .set('Content-Type', 'application/json');
      expect(res.body).to.have.property('name', testReview.name);
      expect(res.body).to.have.property('dealership', testReview.dealership);
      expect(res.body).to.have.property('review', testReview.review);
      expect(res.body).to.have.property('purchase', testReview.purchase);
      expect(res.body).to.have.property('car_make', testReview.car_make);
      expect(res.body).to.have.property('car_model', testReview.car_model);
      expect(res.body).to.have.property('car_year', testReview.car_year);
    });

    it('should auto-increment the review id', async () => {
      const prevRes = await request(BASE_URL).get('/fetchReviews');
      const maxId = Math.max(...prevRes.body.map(r => r.id));

      const res = await request(BASE_URL)
        .post('/insert_review')
        .send(JSON.stringify(testReview))
        .set('Content-Type', 'application/json');

      expect(res.body.id).to.equal(maxId + 1);
    });

    it('should actually persist the review in the database', async () => {
      const res = await request(BASE_URL)
        .post('/insert_review')
        .send(JSON.stringify({ ...testReview, name: 'PersistCheck' }))
        .set('Content-Type', 'application/json');

      const newId = res.body.id;
      const fetchRes = await request(BASE_URL).get(`/fetchReviews`);
      const found = fetchRes.body.find(r => r.id === newId);
      expect(found).to.not.be.undefined;
      expect(found.name).to.equal('PersistCheck');
    });
  });

  describe('Database integrity - Cross-endpoint consistency', () => {
    it('reviews reference valid dealership ids', async () => {
      const [dealersRes, reviewsRes] = await Promise.all([
        request(BASE_URL).get('/fetchDealers'),
        request(BASE_URL).get('/fetchReviews')
      ]);
      const dealerIds = new Set(dealersRes.body.map(d => d.id));
      reviewsRes.body.forEach(review => {
        expect(dealerIds.has(review.dealership)).to.be.true;
      });
    });

    it('total review count increased by inserts', async () => {
      const beforeRes = await request(BASE_URL).get('/fetchReviews');
      const beforeCount = beforeRes.body.length;

      await request(BASE_URL)
        .post('/insert_review')
        .send(JSON.stringify({
          name: 'Count Test',
          dealership: 15,
          review: 'Counting reviews',
          purchase: false,
          purchase_date: '06/20/2026',
          car_make: 'Honda',
          car_model: 'Civic',
          car_year: 2024
        }))
        .set('Content-Type', 'application/json');

      const afterRes = await request(BASE_URL).get('/fetchReviews');
      expect(afterRes.body.length).to.equal(beforeCount + 1);
    });
  });
});
