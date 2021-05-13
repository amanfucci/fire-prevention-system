import numpy as np
co2_set = [i for i in range(400, 29206)]
#96.2%/2600=0.00037, 3.8%/26206=1.4500496069602379*^-6
co2_prob = [0.00037 if i< 3000 else 0.0000014500496069602379 for i in range(400, 29206)]

print("0.0003: ",co2_prob.count(0.0003))
print("0.000008395024040: ",co2_prob.count(0.000008395024040))
print(np.sum(co2_prob))
np.random.choice(co2_set, 1000, p=co2_prob)