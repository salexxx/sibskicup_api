const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require("path");
const expressHbs = require('express-handlebars');
const hbs = expressHbs.create({
      
    layoutsDir: 'views/layouts',
    defaultLayout: 'main',
    partialsDir: "views/partials/",
    extname: 'hbs',
    
});
require("./public/js/helpers").register(hbs.handlebars)    

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/public')));
app.engine('hbs', hbs.engine)
   
// create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ZxZ953&&',
    database: 'sibskicup'
})

// connect to MySQL
 db.connect( err => {
     if(err) {
         throw err
     }
     console.log('MySQL Connected')
 })

 // get Champ
 app.get('/champ/:champId', (req, res) => {
     // собираем чемпионаты в табл
    const sql = 'select etap.etap_id, DATE_FORMAT(etap.data, "%d.%m.%Y") as date, disc.name as disc, place.name as place, city.name as sity, etap.sost FROM etap JOIN disc  on etap.disc_id = disc.disc_id join place on etap.place_id = place.place_id join city on place.city_id = city.city_id AND etap.champ_id =' + req.params.champId + ' order by data'
    db.query(sql, (err, result) => {
        if(err) {
            throw err
        }
    // для отрисовки имени и года чемпионата 
    const sql1 = 'select name, year from champ where champ_id =' + req.params.champId 
    db.query(sql1, (err, result1) => {
        if(err) {
            throw err
        }
        res.render('champ.hbs', {'name': result1[0].name, 'year': result1[0].year, 'data': result})
    })
    })
})

// get Race
app.get('/etap/:etapId', (req, res) => {
    // протокол без групп женщины
    const sqlWomenOverall = 'select * from(    SELECT b.man_id, b.num,b.f_name, b.name, b.age,b.city, b.1_pop as f_pop ,b.2_pop as s_pop, b.summ, b.rank FROM  (   SELECT t.*, @index := @index + 1 as rownum,                   @rank := (case                   when @b_summ = t.summ then                   @rank                   when @b_summ := t.summ then                   @index                   WHEN @b_summ = 0 OR @temp_point IS NULL THEN                   @index                   end) as rank                    FROM    (SELECT                         num, man.man_id as man_id,           man.f_name, man.name,            date_format(man.age, "%Y") as age,            city.name as city,            1_pop, 2_pop, (1_pop + 2_pop) as summ              from    man_etap     JOIN man on  man_etap.man_id = man.man_id     JOIN city on city.city_id = man.city_id     and etap_id = +' +req.params.etapId+ ' and doehal = "True" and gender = "false"      order by summ) as t, ( SELECT @rank := 0 ,@rowtotal := NULL ,@index := 0 ) r) AS b ) as c       left join mesto_ochki on mesto_ochki.mesto = c.rank'
    db.query(sqlWomenOverall, (err, resultWomen) => {
        if(err) throw err
   
    // протокол без групп , мужчины
   const sqlMenOverall = 'select * from(    SELECT b.man_id, b.num,b.f_name, b.name, b.age,b.city, b.1_pop as f_pop ,b.2_pop as s_pop, b.summ, b.rank FROM  (   SELECT t.*, @index := @index + 1 as rownum,                   @rank := (case                   when @b_summ = t.summ then                   @rank                   when @b_summ := t.summ then                   @index                   WHEN @b_summ = 0 OR @temp_point IS NULL THEN                   @index                   end) as rank                    FROM    (SELECT                         num, man.man_id as man_id,           man.f_name, man.name,            date_format(man.age, "%Y") as age,            city.name as city,            1_pop, 2_pop, (1_pop + 2_pop) as summ              from    man_etap     JOIN man on  man_etap.man_id = man.man_id     JOIN city on city.city_id = man.city_id     and etap_id = +' +req.params.etapId+ ' and doehal = "True" and gender = "true"      order by summ) as t, ( SELECT @rank := 0 ,@rowtotal := NULL ,@index := 0 ) r) AS b ) as c       left join mesto_ochki on mesto_ochki.mesto = c.rank'
   db.query(sqlMenOverall, (err, resultMen) => {
        if(err) {
            throw err
        }

        // не закончили соревнования
        const sqlDontfinish = 'select num, man.man_id as man_id,        man.f_name, man.name,         date_format(man.age, "%Y") as age,        city.name as city,        1_pop as f_pop, 2_pop as s_pop                        from    man_etap JOIN man on  man_etap.man_id = man.man_id JOIN city on city.city_id = man.city_id and etap_id ='+req.params.etapId +' and doehal = "false" order by gender'
        db.query(sqlDontfinish, (err, resultDNF) => {
            if(err) {
                throw err
            }
            
            // кондиции 
            const conditionQuery = 'select disc.name as disc, DATE_FORMAT(etap.data, "%e.%m.%Y") as date, place.name as place, place.place_id, gl_judje, gl_secret, postman, fin_judje, lenght, vorota, perepad, pogoda FROM etap JOIN disc on disc.disc_id = etap.disc_id join place on place.place_id = etap.place_id and etap_id =' + req.params.etapId 
            db.query(conditionQuery, (err, result1) => {
                if(err) {
                    throw err
                }
                
                // + название
                const data = {'name': result1[0].disc, 'men': resultMen, 'women': resultWomen, 'condition': result1, 'dnf': resultDNF, 'etap': req.params.etapId}
                res.render('etap', data)
            })
         })
        
      })
  
    })
})

 // get all champ
 app.get('/', (req, res) => {
    const sql = 'select * from champ';
    db.query(sql, (err, result) => {
        if(err) {
            throw err
        }
        result = result.reverse();
        res.render('champs.hbs', {layout: 'main', result});
    })
})

 // get contact
 app.get('/contact', (req, res) => {
    res.render('contact.hbs', {layout: 'main'});
})

 app.listen('3000', () => {
     console.log('server started on port 3000')
 })

