SELECT timestamp from snapshot
where timestamp between '2021-05-12 00:10:00' and TIMESTAMPADD(HOUR,1,'2021-05-12 00:10:00');