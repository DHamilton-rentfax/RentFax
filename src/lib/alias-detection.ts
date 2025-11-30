import { generateIdentityHash, normalize } from './identity-hash';

// Function to generate potential aliases
export function generateAliases(fullName: string) {
  const names = fullName.split(' ').map(normalize);
  const aliases = new Set<string>();

  // Basic permutations
  for (let i = 0; i < names.length; i++) {
    for (let j = 0; j < names.length; j++) {
      if (i !== j) {
        aliases.add(`${names[i]} ${names[j]}`);
        aliases.add(`${names[j]} ${names[i]}`);
      }
    }
  }

  // Initials
  if (names.length > 1) {
    const firstName = names[0];
    const lastName = names[names.length - 1];
    const middleNames = names.slice(1, -1);

    // J. Smith
    aliases.add(`${firstName[0]} ${lastName}`);

    // John F. Smith
    if (middleNames.length > 0) {
      aliases.add(`${firstName} ${middleNames.map((n) => n[0]).join(' ')} ${lastName}`);
    }
  }

  return Array.from(aliases);
}

// Function to find potential matches based on aliases
export async function findAliasMatches(db, renter) {
  const aliases = generateAliases(renter.fullName);
  const matches = [];

  for (const alias of aliases) {
    const hash = generateIdentityHash({ ...renter, fullName: alias });
    const query = await db.collection('renters').where('identityHash', '==', hash).get();
    if (!query.empty) {
      matches.push(...query.docs.map((doc) => doc.data()));
    }
  }

  return matches;
}
