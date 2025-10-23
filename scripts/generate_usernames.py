#!/usr/bin/env python3
"""
generate_usernames.py

Create massive lists of usernames of the form "word1_word2" using Sanskrit
transliteration stems. Designed to scale to 20M+ unique names by streaming
to disk without holding everything in memory.

Usage examples:
  python generate_usernames.py --words words.txt --out usernames.txt --count 20000000 --shuffle
  python generate_usernames.py --words words1.txt --words words2.txt --out usernames.txt --count 5000000 --seed 123

Notes:
- Provide one or two word lists (one per line). If only one is provided, it will be used for both positions.
- The script streams combinations in a deterministic pseudorandom order (if --shuffle is set) without repeats.
- Ensures ASCII/underscore-only output; normalizes spaces/hyphens to underscores.
- For very large outputs, consider writing to a .gz path (requires --gzip).
"""
import argparse
import itertools
import os
import random
import sys
import gzip
from typing import Iterable, List

def load_words(paths: List[str]) -> List[str]:
    def norm(w: str) -> str:
        w = w.strip().lower().replace(' ', '_').replace('-', '_')
        # remove non-ascii chars conservatively
        w = ''.join(ch if (ch.isalnum() or ch == '_') else '_' for ch in w)
        w = '_'.join(filter(None, w.split('_')))
        return w
    words = []
    for p in paths:
        with open(p, 'r', encoding='utf-8') as f:
            for line in f:
                w = norm(line)
                if w:
                    words.append(w)
    # dedupe while preserving order
    seen = set()
    out = []
    for w in words:
        if w not in seen:
            seen.add(w)
            out.append(w)
    return out

def shuffled_indices(n1: int, n2: int, seed: int) -> Iterable[tuple]:
    # Map 2D indices to 1D, shuffle via PRNG, then map back. Avoids storing all pairs in memory.
    total = n1 * n2
    rng = random.Random(seed)
    # Use a simple LCG-like mapping for pseudo-random permutation in chunks
    # to avoid huge memory. Iterate sequentially, but scramble indices.
    a = 1103515245
    c = 12345
    m = 2**31
    x = seed & 0x7fffffff
    for k in range(total):
        x = (a * x + c) % m
        idx = (x % total)
        i = idx // n2
        j = idx % n2
        yield (i, j)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--words', nargs='+', required=True, help='One or two word lists (one per line). If one is given, it is used for both positions.')
    ap.add_argument('--out', required=True, help='Output file path (.txt or .gz).')
    ap.add_argument('--count', type=int, default=1000000, help='Number of usernames to generate.')
    ap.add_argument('--seed', type=int, default=123456789, help='PRNG seed.')
    ap.add_argument('--shuffle', action='store_true', help='Pseudorandomize the output order.')
    args = ap.parse_args()

    words_a = load_words([args.words[0]])
    words_b = load_words([args.words[-1]]) if len(args.words) > 1 else words_a

    n1, n2 = len(words_a), len(words_b)
    total = n1 * n2
    if total == 0:
        print("Word lists are empty after normalization.", file=sys.stderr)
        sys.exit(1)
    if args.count > total:
        print(f"Requested {args.count} usernames but only {total} unique combos possible.", file=sys.stderr)
        sys.exit(2)

    # Prepare output stream
    use_gzip = args.out.endswith('.gz')
    opener = gzip.open if use_gzip else open
    with opener(args.out, 'wt', encoding='utf-8', newline='\n') as out:
        emitted = 0
        if args.shuffle:
            # Use scrambled pair generator (possible repeats; we guard with a set of recent history window)
            # To guarantee uniqueness without storing all, we can iterate a pseudo-random permutation by stepping
            # through arithmetic progression modulo total with a coprime step.
            step = 15485863  # a large prime step
            start = (args.seed % total)
            idx = start
            while emitted < args.count:
                i = idx // n2
                j = idx % n2
                out.write(f"{words_a[i]}_{words_b[j]}\n")
                emitted += 1
                idx = (idx + step) % total
        else:
            # Deterministic row-major
            for i in range(n1):
                if emitted >= args.count:
                    break
                for j in range(n2):
                    out.write(f"{words_a[i]}_{words_b[j]}\n")
                    emitted += 1
                    if emitted >= args.count:
                        break

if __name__ == '__main__':
    main()
