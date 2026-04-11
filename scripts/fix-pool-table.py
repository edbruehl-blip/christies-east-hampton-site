#!/usr/bin/env python3
"""Fix the Ilija pro forma profit pool table — remove Christie's RE column, fix Ilija to 65%."""

path = '/home/ubuntu/christies-eh-replatform/client/src/lib/pdf-exports.ts'

with open(path, 'r') as f:
    content = f.read()

# Find and replace the old 3-party table
old_header = "    ['Year', 'Volume', 'Pool (2%)', 'Ed *', 'Ilija *', \"Christie's RE *\"],"
new_header = "    ['Year', 'Volume', 'Pool (2%)', 'Ed *', 'Ilija *'],"

old_cols = "    [cw * 0.1, cw * 0.14, cw * 0.14, cw * 0.14, cw * 0.14, cw * 0.34],"
new_cols = "    [cw * 0.12, cw * 0.18, cw * 0.22, cw * 0.24, cw * 0.24],"

old_rows = [
    "      ['2026', '$107.5M', '2% above $40M', '35%', '60%', '5%'],",
    "      ['2027', '$273M',   '2% above $40M', '35%', '60%', '5%'],",
    "      ['2028', '$383.5M', '2% above $40M', '35%', '60%', '5%'],",
    "      ['2030', '$641.4M', '2% above $40M', '35%', '60%', '5%'],",
    "      ['2031', '$798.5M', '2% above $40M', '35%', '60%', '5%'],",
    "      ['2033', '$1.101B', '2% above $40M', '35%', '60%', '5%'],",
]
new_rows = [
    "      ['2026', '$55M',    '2% above $40M', '35%', '65%'],",
    "      ['2027', '$273M',   '2% above $40M', '35%', '65%'],",
    "      ['2028', '$383.5M', '2% above $40M', '35%', '65%'],",
    "      ['2031', '$798.5M', '2% above $40M', '35%', '65%'],",
    "      ['2033', '$1.101B', '2% above $40M', '35%', '65%'],",
]

changes = 0

if old_header in content:
    content = content.replace(old_header, new_header, 1)
    changes += 1
    print(f"Fixed header: {old_header[:60]}...")

if old_cols in content:
    content = content.replace(old_cols, new_cols, 1)
    changes += 1
    print(f"Fixed columns")

for old_r, new_r in zip(old_rows, new_rows):
    if old_r in content:
        content = content.replace(old_r, new_r, 1)
        changes += 1

print(f"Total changes: {changes}")

with open(path, 'w') as f:
    f.write(content)

print("Done. Verifying...")
with open(path, 'r') as f:
    verify = f.read()

if "Christie's RE *" in verify:
    print("ERROR: Christie's RE still present!")
elif "60%', '5%']" in verify:
    print("ERROR: old 60%/5% split still present!")
else:
    print("CLEAN: Ed 35% / Ilija 65% / two parties only confirmed.")
