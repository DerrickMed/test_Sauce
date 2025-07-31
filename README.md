
## Installation
```bash
npm install
npx playwright install
npm test //to run tests 
npm run test ui //to run with Playwright ui 
```

## Environment Variables

- `BASE_URL`: Application URL (default: https://www.saucedemo.com) for ci/cd purposes
- `TEST_USER`: Username (default: standard_user) for testing other scenarious with different users
- `TEST_PASSWORD`: Password (default: secret_sauce)

## Docker
```bash
docker-compose up --build
```
