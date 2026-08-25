import asyncio, edge_tts

async def main():
    voices = await edge_tts.list_voices()
    pt_voices = [v for v in voices if v['Locale'].startswith('pt')]
    for v in pt_voices:
        vtype = v.get('VoiceType', 'Neural')
        print("{0} | {1} | {2} | {3}".format(v['ShortName'], v['Locale'], v['Gender'], vtype))

asyncio.run(main())