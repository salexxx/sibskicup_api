select * from(SELECT b.num,b.f_name, b.name, b.age,b.city, b.1_pop,b.2_pop, b.summ,b.rownum AS rank FROM (               SELECT t.*, @rownum := @rownum + 1 AS rownum               FROM(SELECT 		(SELECT @rownum := 0) r,		num,        man.f_name, man.name,         date_format(man.age, "%Y") as age,        city.name as city,        1_pop, 2_pop, (1_pop + 2_pop) as summ      from    man_etap JOIN man on  man_etap.man_id = man.man_id JOIN city on city.city_id = man.city_id and etap_id = 12 and doehal = 'True' and gender = 'true'  order by summ) as t  ) AS b ) as c join mesto_ochki on mesto_ochki.mesto = c.rank