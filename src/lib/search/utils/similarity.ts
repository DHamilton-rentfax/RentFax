// src/lib/search/utils/similarity.ts

// Using Sørensen-Dice coefficient for string similarity
function getBigrams(str: string): string[] {
    const bigrams = new Set<string>();
    const s = str.toLowerCase();
    for (let i = 0; i < s.length - 1; i++) {
        bigrams.add(s.substring(i, i + 2));
    }
    return Array.from(bigrams);
}

export function similarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;

    const bigrams1 = getBigrams(str1);
    const bigrams2 = getBigrams(str2);

    let intersectionCount = 0;
    const len1 = bigrams1.length;
    const len2 = bigrams2.length;

    for (let i = 0; i < len1; i++) {
        for (let j = 0; j < len2; j++) {
            if (bigrams1[i] === bigrams2[j]) {
                intersectionCount++;
                break;
            }
        }
    }

    return (2 * intersectionCount) / (len1 + len2);
}
