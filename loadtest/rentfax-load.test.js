
import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
  vus: 50,           // 50 concurrent virtual users
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'], // <1% errors
    http_req_duration: ['p(95)<600'],
  },
}

export default function () {
  const res = http.get('https://rentfax-staging.web.app/api/health')
  check(res, { 'status 200': (r) => r.status === 200 })
  sleep(1)
}
