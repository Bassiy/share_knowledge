SELECT 
    t1.name,
    t2.item,
    t2.price
FROM
    users t1
INNER JOIN
    orders t2 ON t1.id = t2.user_id
;