import requests, os, json

headers = {'Authorization': os.getenv('PEXELS_API_KEY', '')}
if not headers['Authorization']:
    print('PEXELS_API_KEY not set')
    exit(1)

searches = [
    ('airplane pilot cockpit vertical', 'aviation'),
    ('family hug vertical', 'family'),
    ('mechanic airplane hangar vertical', 'aviation'),
    ('father son talking vertical', 'family'),
    ('pilot uniform portrait vertical', 'aviation'),
    ('family dinner vertical', 'family'),
    ('airplane maintenance vertical', 'aviation'),
    ('family walking vertical', 'family'),
]

for query, category in searches:
    url = f'https://api.pexels.com/v1/search?query={query}&orientation=portrait&per_page=5'
    r = requests.get(url, headers=headers)
    data = r.json()
    print(f'\n=== {category}: {query} ===')
    for photo in data.get('photos', [])[:3]:
        src = photo['src']['original']
        print(f'  {photo["width"]}x{photo["height"]} - {src}')