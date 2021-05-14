import mysql.connector
import mysql.connector.cursor
import datetime as d
import numpy as np

#db conn.
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="fire_prevention_system"
)
try:
    mycursor = mydb.cursor()
    mycursor.callproc("take_snapshot",['2021-05-12 00:06:30', 'NULL', 'NULL'])
    mydb.commit()
except mysql.connector.Error as e:
    print(e)