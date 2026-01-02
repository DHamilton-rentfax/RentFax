import os
from collections import defaultdict
roots = defaultdict(set)
for dirpath, dirnames, _ in os.walk("src/app"):
    for d in dirnames:
        if d in ("[id]","[slug]"):
            roots[dirpath].add(d)
conflicts = {p: v for p,v in roots.items() if "[id]" in v and "[slug]" in v}
for p in sorted(conflicts):
    print("CONFLICT:", p, "has", conflicts[p])
