import mysql.connector
import datetime as d
import numpy as np

# settings
n_nodes = 1000
start_id = 3828095009354745391
updateId_start = 0

# random sets and weights
temperatura_set = [i for i in range(-20, 80)]
# 80%/20=0.04, 19.00%/19=0.009995 , 1%/61=0.000163934426
temperatura_prob = [0.04 if 10 < i <= 30 else 0.01 if 30 <
                    i < 50 else 0.000163934426 for i in range(-20, 80)]

umidita_set = [i for i in range(1, 101)]
# 91%/70=0.013571428571428, 9%/30=0.003
umidita_prob = [0.013 if i > 30 else 0.003 for i in range(1, 101)]

co2_set = [i for i in range(400, 29206)]
# 96.2%/2600=0.00037, 3.8%/26206=1.4500496069602379*^-6
co2_prob = [0.00037 if i <
            3000 else 0.0000014500496069602379 for i in range(400, 29206)]

tvoc_set = [i for i in range(0, 32768)]
# 90%/3000=0.0003, 10%/29768=0.000003359312012899758
tvoc_prob = [0.0003 if i <
             3000 else 0.000003359312012899758 for i in range(0, 32768)]

# db conn.
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="fire_prevention_system"
)
mycursor = mydb.cursor()
sql = "INSERT INTO misurazioni (sensore, temperatura, umidita, co2, tvoc, updateId, timestamp)"
sql += "VALUES (%s, %s, %s, %s, %s, %s, %s)"

# data ins.
timestamp = d.datetime(2021, 5, 12, hour=1, minute=0, second=0)
for y in range(0, 15):
    timestamp += d.timedelta(minutes=5)
    temperatura = np.random.choice(
        temperatura_set, n_nodes, p=temperatura_prob)
    umidita = np.random.choice(umidita_set, n_nodes, p=umidita_prob)
    co2 = np.random.choice(co2_set, n_nodes, p=co2_prob)
    tvoc = np.random.choice(tvoc_set, n_nodes, p=tvoc_prob)
    for x in range(0, n_nodes):
        rnd_ts = timestamp + (np.random.rand() * d.timedelta(seconds=90))
        val = (start_id+x, int(temperatura[x]), int(umidita[x]),
               int(co2[x]), int(tvoc[x]), int(updateId_start + x), rnd_ts)
        # print(val)
        mycursor.execute(sql, val)
        mydb.commit()
    max_ts = (timestamp + d.timedelta(seconds=90)).strftime("%Y-%m-%d %H:%M:%S")
    temp = "CALL take_snapshot('" + max_ts +"', NULL, NULL);"
    print(temp)
    try:
      mycursor = mydb.cursor()
      mycursor.callproc("take_snapshot", [max_ts, 'NULL', 'NULL'])
      mydb.commit()
    except mysql.connector.Error as e:
      print(e)
