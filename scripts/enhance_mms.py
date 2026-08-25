"""
Enhanced MMS-TTS Portuguese with post-processing for more natural sound
"""
from transformers import pipeline
import torch
import soundfile as sf
import numpy as np
import librosa
import scipy.signal

def add_natural_pauses(text, min_pause=0.3, max_pause=0.8):
    """Add natural pauses at punctuation"""
    import re
    # Add pauses at punctuation
    text = re.sub(r'([.!?])\s+', r'\1 <pause> ', text)
    text = re.sub(r'([,;:])\s+', r'\1 <short_pause> ', text)
    return text

def add_breath_noise(audio, sr, breath_prob=0.1, breath_duration=0.2):
    """Add subtle breath sounds at random intervals"""
    breath_samples = int(0.3 * sr)  # 300ms breaths
    breath = np.random.randn(breath_samples) * 0.01 * np.hanning(breath_samples)
    result = []
    pos = 0
    while pos < len(audio):
        chunk_size = np.random.randint(int(2*sr), int(5*sr))
        chunk = audio[pos:pos+chunk_size]
        result.append(chunk)
        pos += chunk_size
        if np.random.random() < breath_prob and pos < len(audio):
            result.append(breath[:min(len(breath), len(audio)-pos)])
    return np.concatenate(result) if result else audio

def vary_pitch_speed(audio, sr, pitch_variance=0.02, speed_variance=0.05):
    """Subtly vary pitch and speed for more natural sound"""
    # Use librosa for pitch shifting
    try:
        # Random pitch shift within variance
        n_steps = np.random.uniform(-pitch_variance*12, pitch_variance*12)
        audio = librosa.effects.pitch_shift(audio, sr=sr, n_steps=n_steps)
        
        # Random time stretch
        rate = np.random.uniform(1-speed_variance, 1+speed_variance)
        audio = librosa.effects.time_stretch(audio, rate=rate)
    except:
        pass
    return audio

def enhance_mms_audio(input_path, output_path, sr=16000):
    """Apply enhancements to MMS-TTS output"""
    audio, sr = sf.read(input_path)
    
    # Normalize
    audio = audio / np.max(np.abs(audio)) * 0.95
    
    # Add subtle reverb for depth
    reverb_len = int(0.1 * sr)
    reverb = np.exp(-np.arange(reverb_len) / (0.05 * sr)) * 0.15
    audio = scipy.signal.fftconvolve(audio, reverb, mode='full')[:len(audio)]
    
    # High-pass filter to remove low-frequency rumble
    audio = librosa.effects.preemphasis(audio, coef=0.97)
    
    # Compress dynamic range slightly
    threshold = 0.3
    ratio = 2.0
    audio = np.where(np.abs(audio) > threshold,
                     np.sign(audio) * (threshold + (np.abs(audio) - threshold) / ratio),
                     audio)
    
    # Normalize final
    audio = audio / np.max(np.abs(audio)) * 0.9
    
    sf.write(output_path, audio, sr)
    print(f'Enhanced audio saved: {output_path}')

# Test with MMS-TTS
from transformers import pipeline
import soundfile as sf

pipe = pipeline('text-to-speech', model='facebook/mms-tts-por', device='cpu')
text = "Olá, este é um teste de síntese de voz em português brasileiro com qualidade profissional e natural."
output = pipe(text)
audio = output['audio']
sr = output['sampling_rate']
sf.write('test_raw.wav', audio, sr)
print(f'Raw: {len(audio)/sr:.2f}s @ {sr}Hz')

# Enhance
enhance_mms_audio('test_raw.wav', 'test_enhanced.wav', sr)
print('Enhanced version saved!')