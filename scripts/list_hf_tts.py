from huggingface_hub import list_models

models = list_models(filter='text-to-speech', limit=50)
for m in models:
    model_id = m.modelId.lower()
    if 'por' in model_id or 'pt-' in model_id or 'brazil' in model_id or 'portuguese' in model_id:
        print(f'{m.modelId} - {m.tags if hasattr(m, "tags") else "no tags"}')
    # Also check tags
    if hasattr(m, 'tags') and m.tags:
        for tag in m.tags:
            if 'portuguese' in tag.lower() or 'pt' in tag.lower() or 'brazil' in tag.lower():
                print(f'{m.modelId} (tag: {tag}) - {m.tags}')