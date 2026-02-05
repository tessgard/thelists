#!/usr/bin/env python3
"""
Generate a new Django SECRET_KEY for production use.
Run this script and copy the output to your Railway environment variables.
"""

from django.core.management.utils import get_random_secret_key

if __name__ == "__main__":
    print("Generated SECRET_KEY for production:")
    print(get_random_secret_key())
