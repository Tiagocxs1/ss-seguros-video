from transformers import pipeline
import torch

# Test VITS Portuguese from Facebook/MMS
pipe = pipeline('text-to-speech', model='facebook/mms-tts-por', device='cpu')
print('MMS-TTS Portuguese loaded!')

# Test
output = pipe('Olá, teste de síntese de voz em português brasileiro')
print('Output keys:', output.keys())
audio = output['audio']
sr = output['sampling_rate']
print('Audio shape:', audio.shape if hasattr(audio, 'shape') else len(audio))
print('Sample rate:', sr)

import soundfile as sf
sf.write('test_mms_por.wav', audio, sr)
print('Saved test_mms_por.wav')