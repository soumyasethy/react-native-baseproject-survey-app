const baseUrl = /*'https://fb.licious.in';*/ 'https://firefly-dev.licious.in';
export const API = {
  login: `${baseUrl}/api/v1/token/`,
  permissions: `${baseUrl}/api/v1/permissions`,
  cities: `${baseUrl}/api/v1/taxonomy/cities`,
  entities: `${baseUrl}/api/v1/taxonomy/city/entities/`,
  outward: `${baseUrl}/api/v1/watchman/outward/`,
  inward: `${baseUrl}/api/v1/watchman/inward/`,
  primeScan: `${baseUrl}/api/v1/watchman/prime-scan/`,
  outwardConnection: `${baseUrl}/api/v1/watchman/outward-connection/`,
};
