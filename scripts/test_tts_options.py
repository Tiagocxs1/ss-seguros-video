# Test multiple Portuguese TTS options
# 1. MMS-TTS (Facebook) - already working
# 2. XTTS-v2 (Coqui) - high quality, voice cloning
# 3. VITS (Facebook MMS) - multiple speakers

from transformers import pipeline, AutoProcessor, VitsModel
import torch
import soundfile as sf

def test_mms_tts():
    print("=== MMS-TTS Portuguese (facebook/mms-tts-por) ===")
    pipe = pipeline('text-to-speech', model='facebook/mms-tts-por', device='cpu')
    output = pipe('Olá, este é um teste de síntese de voz em português brasileiro com qualidade profissional.')
    audio = output['audio']
    sr = output['sampling_rate']
    print(f'Sample rate: {sr}Hz, Duration: {len(audio)/sr:.2f}s')
    import soundfile as sf
    sf.write('test_mms_por.wav', audio, sr)
    print('Saved test_mms_por.wav')

def test_vits_por():
    print("\n=== VITS Portuguese (facebook/mms-tts-por with speakers) ===")
    # MMS-TTS has multiple speakers for some languages
    # Check if Portuguese has multiple speakers
    from transformers import AutoProcessor, VitsModel
    processor = AutoProcessor.from_pretrained("facebook/mms-tts-por")
    model = VitsModel.from_pretrained("facebook/mms-tts-por")
    
    # Check if model has speaker embeddings
    print(f'Model config: {model.config}')
    if hasattr(model.config, 'num_spkrs'):
        print(f'Number of speakers: {model.config.num_spkrs}')
    else:
        print('Single speaker model')

if __name__ == '__main__':
    test_mms_tts()
    test_vits_por()