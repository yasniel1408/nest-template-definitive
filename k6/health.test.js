import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },    // Rampa de subida a 50 usuarios
    { duration: '1m', target: 50 },     // Mantener 50 usuarios por 1 minuto
    { duration: '30s', target: 100 },   // Subir a 100 usuarios en 30s
    { duration: '2m', target: 100 },    // Mantener 100 usuarios por 2 minutos
    { duration: '30s', target: 150 },   // Pico de carga a 150 usuarios
    { duration: '1m', target: 150 },    // Mantener pico por 1 minuto
    { duration: '30s', target: 0 },     // Rampa de bajada
  ],
  thresholds: {
    http_req_duration: ['p(95)<50', 'p(99)<1000'],  // 95% bajo 50ms, 99% bajo 1s
    http_req_failed: ['rate<0.01'],                    // Menos del 1% de errores
    http_reqs: ['rate>10000'],                          // Mínimo 100 solicitudes por segundo
    iterations: ['count>1000'],                       // Mínimo 1000 iteraciones totales
  },
};

export default function () {
  const response = http.get('http://localhost:8080/api/health');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has correct structure': (r) => {
      const body = JSON.parse(r.body);
      return (
        body.hasOwnProperty('name') &&
        body.hasOwnProperty('version') &&
        body.hasOwnProperty('env') &&
        body.hasOwnProperty('status')
      );
    },
    'status is ok': (r) => JSON.parse(r.body).status === 'ok',
  });

  // sleep(1);
}