import json

with open('client/public/state.json', 'r') as f:
    data = json.load(f)

dl = data['doctrine_library']

# Add D39, D40, D41 verbatim from Ed's dispatch
new_locks = [
    {
        "id": "39",
        "title": "Agent Splits at 70 Percent of Gross GCI",
        "summary": "Agent splits at CIREG – East Hampton compute on 70 percent of gross GCI at every volume level. The royalty and overhead and company dollar share come out of the remaining 30 percent company dollar side, not deducted before the agent split. Agents earn their full 70 percent on gross production. This doctrine applies to every agent on the flagship team operating under the CIREG contractor structure including Ed's ICA team production that flows through his brokerage license. Supersedes any prior formula that computed agent splits on a post-royalty base (including the pre-April 14 formula \"Agent Splits = (GCI − Royalty) × 70%\" which is non-canonical).",
        "locked": "April 14, 2026",
        "category": "Profit Mechanics"
    },
    {
        "id": "40",
        "title": "70/25/5 Structural Split",
        "summary": "The CIREG – East Hampton company dollar structure is 70 percent to the agent side and 30 percent to the company dollar side. The 30 percent company dollar side divides into 25 percent to Ilija (covering overhead and his partnership share) and 5 percent to Christie's International Real Estate as the franchise royalty. The 5 percent royalty is Ilija's cost carried out of his 25 percent company dollar allocation not a line item deducted from gross before the agent split. This structure is why the NOP split between Ed and Ilija is 35/65 rather than 50/50 — Ilija carries the royalty and infrastructure cost in exchange for the larger NOP share.",
        "locked": "April 14, 2026",
        "category": "Profit Mechanics"
    },
    {
        "id": "41",
        "title": "Royalty Out Before NOP Split",
        "summary": "The sequence of deductions in the CIREG – East Hampton profit computation is locked. Gross GCI minus agent splits equals company dollar. Company dollar minus overhead minus royalty equals net operating profit (NOP). The 35/65 split between Ed and Ilija applies to NOP after overhead and royalty are already deducted on Ilija's company dollar side. This sequencing is canonical and any formula that computes the split on a different base (including the old pre-April 14 formula that deducted royalty before agent splits) is non-canonical and needs correction. The canonical formula: GCI = Volume × 2%. Agent Splits = GCI × 70%. Company Dollar = GCI × 30%. Royalty = GCI × 5% (Ilija's cost). Overhead = MAX($200,000, GCI × 6%). NOP = Company Dollar − Royalty − Overhead. Ed 35% / Ilija 65% on NOP.",
        "locked": "April 14, 2026",
        "category": "Profit Mechanics"
    }
]

# Append to locks array
dl['locks'].extend(new_locks)

# Bump counters
dl['canonical_total'] = 48
dl['main_locks'] = 43
dl['sub_doctrines'] = 5

# Write back
with open('client/public/state.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Done. canonical_total={dl['canonical_total']}, main_locks={dl['main_locks']}, sub_doctrines={dl['sub_doctrines']}, locks count={len(dl['locks'])}")
print("Last 3 lock IDs:", [l['id'] for l in dl['locks'][-3:]])
