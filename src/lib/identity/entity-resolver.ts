export function resolveShadowEntity(profile: any, linkedProfiles: any[]) {
  const cluster: string[] = [];

  for (const lp of linkedProfiles) {
    let matchScore = 0;

    if (profile.dlHash && lp.dlHash === profile.dlHash) matchScore = 100;
    else {
      if (profile.dob === lp.dob) matchScore += 40;
      if (profile.phone === lp.phone) matchScore += 20;
      if (profile.email === lp.email) matchScore += 20;
      if (profile.address === lp.address) matchScore += 15;
    }

    if (matchScore >= 60) {
      cluster.push(lp.renterId);
    }
  }

  return cluster;
}
