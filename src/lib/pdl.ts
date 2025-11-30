// src/lib/pdl.ts
import 'server-only';

const PDL_BASE_URL = process.env.PDL_BASE_URL ?? 'https://api.peopledatalabs.com/v5';
const PDL_API_KEY = process.env.PDL_API_KEY;

if (!PDL_API_KEY) {
  console.warn('[PDL] Missing PDL_API_KEY environment variable');
}

export type PdlPersonMatch = {
  id?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  // You can expand as needed
  [key: string]: any;
};

export type PdlSearchResult = {
  status: number;
  total: number;
  data: PdlPersonMatch[];
};

export async function searchPersonWithPDL(params: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}) {
  if (!PDL_API_KEY) {
    return { status: 401, total: 0, data: [] } as PdlSearchResult;
  }

  const url = new URL(`${PDL_BASE_URL}/person/search`);

  // PDL accepts a "sql" style query or filters. Keep it simple & safe.
  const filters: string[] = [];

  if (params.email) {
    filters.push(`email = '${params.email}'`);
  }
  if (params.phone) {
    filters.push(`phone_numbers LIKE '%${params.phone.replace(/'/g, '')}%'`);
  }
  if (params.firstName && params.lastName) {
    filters.push(`(first_name = '${params.firstName}' AND last_name = '${params.lastName}')`);
  }

  // Fallback if no strong identifiers – just use name
  if (!filters.length && (params.firstName || params.lastName)) {
    filters.push(`(first_name = '${params.firstName ?? ''}' OR last_name = '${params.lastName ?? ''}')`);
  }

  // If somehow still empty, don't call PDL
  if (!filters.length) {
    return { status: 400, total: 0, data: [] } as PdlSearchResult;
  }

  const sql = `SELECT * FROM person WHERE ${filters.join(' AND ')} LIMIT 10`;

  url.searchParams.set('api_key', PDL_API_KEY);
  url.searchParams.set('sql', sql);

  const res = await fetch(url.toString(), {
    method: 'GET',
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[PDL] Error response', res.status, text);
    return { status: res.status, total: 0, data: [] } as PdlSearchResult;
  }

  const data = (await res.json()) as PdlSearchResult;
  return data;
}
