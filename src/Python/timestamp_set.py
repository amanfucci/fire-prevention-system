import datetime as d
import numpy as np

timestamp  = d.datetime(2020, 5, 12, hour=0, minute=0, second=0)
for x in range(0,100):
    timestamp += d.timedelta(minutes=5)
    dt = timestamp + np.random.rand() * d.timedelta(minutes=5)
    print(dt)