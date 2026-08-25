# Test Bark (suno/bark) for Portuguese TTS
from transformers import BarkModel, BarkProcessor
import torch
import soundfile as sf

print("Loading Bark model...")
model = BarkModel.from_pretrained("suno/bark", device_map="cpu")
processor = BarkProcessor.from_pretrained("suno/bark")

# Generate audio
text = "Olá, este é um teste do Bark em português brasileiro com qualidade profissional."
inputs = processor(text, voice_preset="v2/pt_speaker_0", return_tensors="pt")

print("Generating audio...")
with torch.no_grad():
    audio = model.generate(**inputs)

audio_np = audio.cpu().numpy().squeeze()
sf.write('test_bark.wav', audio_np, samplerate=24000)
print(f'Saved test_bark.wav')

import soundfile as sf
info = sf.info('test_bark.wav')
print(f'Duration: {info.duration:.2f}s, Sample rate: {info.samplerate}Hz, Channels: {info.channels}')