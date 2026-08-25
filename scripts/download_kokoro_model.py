import urllib.request
import os

model_url = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/kokoro-v0_19.onnx'
voices_url = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/voices.json'

print('Downloading model...')
urllib.request.urlretrieve(model_url, 'kokoro-v0_19.onnx')
print('Model downloaded')

print('Downloading voices...')
urllib.request.urlretrieve(voices_url, 'voices.json')
print('Voices downloaded')

print('Model size: {:.1f} MB'.format(os.path.getsize('kokoro-v0_19.onnx') / 1024 / 1024))
print('Voices size: {:.1f} KB'.format(os.path.getsize('voices.json') / 1024))