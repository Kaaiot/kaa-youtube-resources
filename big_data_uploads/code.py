import json
import math
import requests
import time

# Config. Paste your values here.
HTTP_KPC_HOST = "https://next.kaaiot.com"  # Paste your KPC host. Unless you're using selfhosted Kaa, this should be next.kaaiot.com or cloud.kaaiot.com
APPLICATION_VERSION = "your-app-version-v1"  # Paste your application version
TOKEN = "your-token"  # Paste your endpoint token
DCX_URL = f"{HTTP_KPC_HOST}/kpc/kp1/{APPLICATION_VERSION}/dcx/{TOKEN}/json"

# Load json database from data.json file
with open("data.json", encoding="utf-8") as f:
    data = json.load(f)

# Publish 10 json objects at a time.
def publish_chunks(data: list[dict], chunk_size: int = 10):
    errors = []
    total_chunks = math.ceil(len(data)/chunk_size)
    print(f'Publishing {len(data)} records. Splitted into {total_chunks} chunks')

    if not 'timestamp' in data[0]:
        raise ValueError('"timestamp" field is required')

    for i in range(0, len(data), chunk_size):
        chunk = data[i:i + chunk_size]
        current_chunk_number = i // chunk_size + 1
        print(f'Publishing chunk {current_chunk_number}/{total_chunks}')

        try:
            response = requests.post(DCX_URL, json=chunk)
            print(response.status_code)
            print(response.text)
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"Error in chunk {current_chunk_number}: {e}")
            errors.append((e, chunk[0]['timestamp'], chunk[-1]['timestamp']))

        print(f'Chunk errors: {len(errors)}')
        time.sleep(1)

    print(f'Total errors: {len(errors)}')

publish_chunks(data)
