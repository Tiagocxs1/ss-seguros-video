import pandas as pd
df = pd.read_csv('roteiro_lito_merged_v3.csv', encoding='utf-8-sig')
for _, row in df.iterrows():
    nar = row['narracao_exata_tts'][:80] if row['narracao_exact_tts'] else 'SEM NARRACAO'
    print(f'{row["ordem"]:2d} | {row["timecode"]} | {row["funcao"]:20s} | {nar}')