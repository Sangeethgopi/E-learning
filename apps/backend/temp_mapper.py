#!/usr/bin/python3
"""mapper.py - Outputs total word count per line"""

import sys

for line in sys.stdin:
    line = line.strip()
    words = line.split()
    print('%s\t%d' % ("total", len(words)))
