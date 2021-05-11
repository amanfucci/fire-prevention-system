USE fire_prevention_system;
SELECT s.lat, s.lon, m.fire_index
FROM misurazioni as m
INNER JOIN sensori as s on m.sensore = s. arduinoId
INNER JOIN snapshot_misurazioni as snm on m.dataId = snm.misurazione
WHERE snm.snapshot = '2021-05-10 16:28:00';