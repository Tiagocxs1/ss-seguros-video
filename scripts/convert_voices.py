import json
import numpy as np

with open('voices.json', 'r') as f:
    data = json.load(f)

print('Total voices:', len(data))
for k, v in list(data.items())[:3]:
    print(k, ':', type(v), 'len=', len(v) if isinstance(v, list) else 'not list')
    if isinstance(v, list):
        print('  First 5:', v[:5])
        print('  Last 5:', v[-5:])

voice_names = list(data.keys())
embeddings = np.array([data[k] for k in voice_names], dtype=np.float32)
print('Embeddings shape:', embeddings.shape)

np.save('voices.npy', embeddings)
with open('voice_names.json', 'w') as f:
    json.dump(voice_names, f)
print('Saved voices.npy and voice_names.json')

loaded = np.load('voices.npy')
print('Loaded shape:', loaded.shape)