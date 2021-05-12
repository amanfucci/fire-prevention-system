import numpy as np
#random sets and weights
temperatura_set = [i for i in range(-19, 81)]
#80%/20=0.04, 19.00%/19=0.009995 , 1%/61=0.000163934426
temperatura_prob = [0.04 if 10<i<=30 else 0.01 if 30<i<50 else 0.000163934426 for i in range(-19, 81)]

print(np.sum(temperatura_prob))
#print("0.04: ",temperatura_prob.count(0.04))
#print("0.009995: ",temperatura_prob.count(0.009995))
#print("0.0000016666: ",temperatura_prob.count(0.0000016666))

for y in range(0,10):
    new_set = np.random.choice(temperatura_set, 1000, p=temperatura_prob)

    fire_index = [0,0,0,0,0,0]
    for x in new_set:
        if x>=80:
            fire_index[5] +=1
        else:
            if x>=60:
                fire_index[4] +=1
            else:
                if x>=40:
                    fire_index[2] += 1
                else:
                    fire_index[0] += 1
    print(fire_index)