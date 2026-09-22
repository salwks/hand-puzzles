#!/usr/bin/env python3
"""Dev server: static files with caching disabled, so edits always show up on reload."""
import os
import re
import socket
import sys
import threading
from urllib.parse import parse_qs, urlparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_POST(self):
        """POST /log?session=<id> appends the body to logs/<id>.jsonl (hand-tracking diagnostics)."""
        url = urlparse(self.path)
        session = parse_qs(url.query).get('session', [''])[0]
        length = int(self.headers.get('Content-Length') or 0)
        if url.path != '/log' or not re.fullmatch(r'[A-Za-z0-9_-]{1,64}', session) or length > 5_000_000:
            self.send_error(400)
            return
        os.makedirs(LOG_DIR, exist_ok=True)
        with open(os.path.join(LOG_DIR, session + '.jsonl'), 'ab') as f:
            f.write(self.rfile.read(length))
        self.send_response(204)
        self.end_headers()

    def log_message(self, fmt, *args):
        if '/log?' not in str(args[0] if args else ''):  # keep the console free of log-upload noise
            super().log_message(fmt, *args)


ROOT = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(ROOT, 'logs')

class V6Server(ThreadingHTTPServer):
    address_family = socket.AF_INET6


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    handler = partial(NoCacheHandler, directory=ROOT)
    print(f'http://localhost:{port}', flush=True)
    # Listen on both loopbacks: Safari resolves "localhost" to ::1 first, others to 127.0.0.1.
    try:
        threading.Thread(target=V6Server(('::1', port), handler).serve_forever, daemon=True).start()
    except OSError:
        pass
    ThreadingHTTPServer(('127.0.0.1', port), handler).serve_forever()
