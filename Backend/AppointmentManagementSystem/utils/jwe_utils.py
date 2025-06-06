import json
from jose import jwe
from django.conf import settings

def encrypt_data(data: dict) -> str:
    payload = json.dumps(data).encode('utf-8')
    key = settings.JWE_SECRET_KEY
    if isinstance(key, str):
        key = key.encode('utf-8')
    if len(key) != 32:
        raise ValueError("JWE_SECRET_KEY must be 32 bytes for A256GCM")
    return jwe.encrypt(payload, key, algorithm='dir', encryption='A256GCM')

def decrypt_data(token: str) -> dict:
    key = settings.JWE_SECRET_KEY
    if isinstance(key, str):
        key = key.encode('utf-8')
    if len(key) != 32:
        raise ValueError("JWE_SECRET_KEY must be 32 bytes for A256GCM")
    decrypted = jwe.decrypt(token, key)
    return json.loads(decrypted)