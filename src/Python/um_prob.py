import numpy as np
umidita_set = [i for i in range(1, 101)]
#91%/70=0.013, 9%/30=0.003
umidita_prob = [0.013 if i>30 else 0.003 for i in range(1, 101)]

print(np.sum(umidita_prob))
np.random.choice(umidita_set, 1000, p=umidita_prob)