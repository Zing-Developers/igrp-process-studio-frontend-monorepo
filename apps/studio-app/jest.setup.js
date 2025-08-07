import '@testing-library/jest-dom';

// Mock fetch globalmente
global.fetch = jest.fn();

// Mock da variável de ambiente
process.env.NEXT_PUBLIC_API_GATEWAY = 'http://localhost:8083'; 