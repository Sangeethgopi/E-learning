import os
import re

api_dir = 'apps/backend/app/api'
for filename in os.listdir(api_dir):
    if filename.endswith('.py'):
        path = os.path.join(api_dir, filename)
        with open(path, 'r') as f:
            content = f.read()
        new_content = re.sub(r'prefix="/api/v1', 'prefix="/v1', content)
        with open(path, 'w') as f:
            f.write(new_content)
print("Updated all prefixes")
