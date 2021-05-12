import numpy as np
tvoc_set = [i for i in range(0, 32768)]
#90%/3000=0.0003, 10%/29768=0.000003359312012899758
tvoc_prob = [0.0003 if i< 3000 else 0.000003359312012899758 for i in range(0, 32768)]

print("0.0003: ",tvoc_prob.count(0.0003))
print("0.000003359312012899758: ",tvoc_prob.count(0.000003359312012899758))
print(np.sum(tvoc_prob))
np.random.choice(tvoc_set, 1000, p=tvoc_prob)