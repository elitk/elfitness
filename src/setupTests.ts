import '@testing-library/jest-dom'; 
import 'whatwg-fetch';
jest.mock('@/lib/firebase/config', () => ({
    auth: {},
    db: {},
    storage: {},
  }));