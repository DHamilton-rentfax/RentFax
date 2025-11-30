// scripts/normalize-slugs.ts
import fs from 'node:fs';
import path from 'node:path';

type Replacement = string;
const rules: Array<[RegExp, Replacement]> = [
  // params { disputeId|incidentId: string }  ->  params { id: string }
  [/(params:\s*\{)\s*(disputeId|incidentId)\s*:\s*string\s*(\})/g, '$1 id: string $3'],

  // useParams<{ ... disputeId|incidentId: string }> -> useParams<{ id: string }>()
  [/useParams<\{.*?(disputeId|incidentId): string \}>/g, 'useParams<{ id: string }>()'],

  // ".../(disputes|incidents)/${disputeId|incidentId}" -> ".../$1/${id}"
  [/(disputes|incidents)\/\$\{(?:disputeId|incidentId)\}/g, '$1/${id}'],
];

function run(file: string) {
  const full = path.resolve(file);
  let contents = fs.readFileSync(full, 'utf8');
  for (const [rx, replacement] of rules) {
    contents = contents.replace(rx, replacement);
  }
  fs.writeFileSync(full, contents);
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: ts-node scripts/normalize-slugs.ts <file>');
    process.exit(1);
  }
  run(file);
}