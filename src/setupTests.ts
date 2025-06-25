import "@testing-library/jest-dom";
import "whatwg-fetch";
jest.mock("@/lib/firebase/config", () => ({
  auth: {},
  db: {},
  storage: {},
}));
// src/setupTests.ts
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
}
