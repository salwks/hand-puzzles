#!/bin/sh
# Starts the optional WiLoR 3D hand-pose server (ws://localhost:8766). The games work without it.
cd "$(dirname "$0")" && exec .venv-wilor/bin/python wilor_server.py
