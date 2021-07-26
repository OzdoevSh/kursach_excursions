
import express = require('express');
import mysql from 'mysql';
import e = require('express');


let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'qwerty3129',
    database: 'kurs'
})

export const getMainPage = (req: any, res: express.Response) => {
    res.render('index', {
        status: req.session.status
    });
}

export const getRegPage = (req: express.Request, res: express.Response) => {
    res.render('registration');
}

export const getVhodPage = (req: express.Request, res: express.Response) => {
    res.render('vhod');
}

export const getExit = (req: any, res: express.Response) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

export const getUserPage = (req: any, res: express.Response) => {
    connection.query("SELECT * FROM kurs.ord_exc INNER JOIN kurs.order ON order_id = id INNER JOIN kurs.excursion ON excursion_id = kurs.excursion.id WHERE client_id = ?", [req.session.client_id], (err, result) =>{
        if (err) {
            console.log('Ошибка БД!', err)
        }else {
            console.log(result)
            res.render('user', {
                chosenExc: req.session.chosenExc,
                ordOrd: result
            });
        }
    })
}


export const postReg = (req: express.Request, res: express.Response) => {
    connection.query("INSERT INTO `kurs`.`client` (`name`, `login`, `password`, `email`) VALUES (?, ?, ?, ?)", [req.body.fullname, req.body.login, req.body.password, req.body.email], (err) => {
        if (err) {
            console.log('Ошибка БД!', err)
        }else {
            console.log('Пользователь зарегестрирован!')
        }
    })
    res.redirect('/user')
}


export const postLogin = (req: any, res: express.Response) => {
    connection.query("SELECT * FROM `kurs`.`client` WHERE login = ? AND password = ?", [req.body.login, req.body.password], (err, result) => {
        if (err) {
            console.log('Ошибка БД!', err)
        }
        if (result.length) {
            console.log('Пользователь вошел!'),
            req.session.status = true;
            req.session.client_id = result[0].id;
            req.session.chosenExc = [];
            res.redirect('/user')
        }else {
            res.send('Пользователя не существует'); 
        }
    })
}

export const getExcursionPage = (req: any, res: express.Response) => {
    connection.query("SELECT * FROM `kurs`.`excursion`", (err, result) => {
        if (err) {
            console.log('Ошибка БД!', err)
        } else{
            console.log('Страница экскурсий')
            res.render('excursion', {
                excInf: result,
                status: req.session.status,
                status_admin: req.session.status_admin
            })
        }
    })
}

export const postExcursion = (req: any, res: express.Response) => {
    let exc = {
        id: req.body.excId,
        name: req.body.excName,
        date: req.body.excDate,
        cost: req.body.excCost
    }
    req.session.chosenExc.push(exc)
    console.log(req.session.chosenExc);
    res.redirect('/excursion')
}

export const getReviewPage = (req: any, res: express.Response) => {
    connection.query("SELECT review.id, description, name, login FROM kurs.review INNER JOIN `client` ON client.id = review.client_id ", (err, result) => {
        if (err) {
            console.log('Ошибка БД!', err)
        }else {
            console.log('Отзывы', result)
            res.render('review', {
                revInf: result,
                status: req.session.status,
                status_admin: req.session.status_admin
            })
        }
    })
}


export const getAddRevPage = (req: express.Request, res: express.Response) => {
    res.render('addreview');
}

export const getAdminLogin = (req: express. Request, res: express.Response) => {
    res.render('adminLogin');
}

export const postAdmin = (req: any, res: express.Response) => {
    connection.query("SELECT * FROM `kurs`.`admin` WHERE login = ? AND password = ?", [req.body.login, req.body.password], function(error, result){
        if (error) {
            console.log(error);
        }
        if (result.length){
            console.log('Админ вошел!');
            req.session.status_admin = true;
            req.session.chosenExc = [];
            res.redirect('/adminPage')
        }
        
    })
}

export const getAdminPage = (req: any, res: express.Response) => {
    console.log(req.session.chosenExc)
    res.render('adminPage', {
        chosenExc: req.session.chosenExc
    });
}




export const postAddOrder = async (req: any, res: express.Response) => {
    if (req.session.chosenExc.length === 0){
        console.log('Не выбран заказ');
        res.redirect('excursion');
    } else{
        const costArr: number [] = []
        const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue
        req.session.chosenExc.forEach((element: any) => {
            for (const key in element) {
                if (key === 'cost') {
                    costArr.push(parseInt(element[key]))
                }
            }
        });
        const  fullCost = costArr.reduce(reducer)
        await connection.query("INSERT INTO `kurs`.`order` (`client_id`, `fullcost`) VALUES ('?', '?');", [req.session.client_id, fullCost] , (error) => {
            if (error) {
                console.log('Ошибка БД!', error)
            }
          })
        await connection.query("SELECT * FROM `order` WHERE id=(SELECT MAX(id) FROM `order`)", (err1, result) => {
            if (err1) {
                console.log('Ошибка БД');   
            }else{
        req.session.chosenExc.forEach( (element: any) => {
                connection.query("INSERT INTO `kurs`.`ord_exc` (`order_id`, `excursion_id`) VALUES (?, ?);", [result[0].id, element.id], (err2) => {
                    if (err2) {
                        console.log('Ошибка БД2', err2);   
                    }
                    })
            });
            res.send('Заказ оформлен!')   
            }
        }) 
    }
}

export const postClearOrder = (req: any, res: express.Response) => {
    req.session.chosenExc = [];
    console.log('exc',req.session.chosenExc);
    res.redirect('/user')
}


export const getAddExcPage = (req: any, res: express.Response) => {
    console.log(req.session.chosenExc)
    res.render('addExc', {
        chosenExc: req.session.chosenExc
    });
}


export const postAddExc = (req: any, res: express.Response) => {
    console.log(req.session)
    connection.query("INSERT INTO `kurs`.`excursion` (`name`, `cost`, `date`, `description`) VALUES (?, ?, ?, ?)", [req.body.excursionName, req.body.excursionCost, req.body.excursionDate, req.body.excursionDesc], (err) => {
        if (err) {
            console.log('Ошибка БД!', err)
        }else {
            console.log('Экскурсия добавлена!')
        }
    })
    res.redirect('/excursion')
}


export const postAddRev = (req: any, res: express.Response) => {
    console.log(req.session);
    connection.query("INSERT INTO `kurs`.`review` (`client_id`, `description`) VALUES (?, ?)", [req.session.client_id, req.body.textreview], (err) => {
        if (err) {
            console.log('Ошибка БД!', err)
        }else {
            console.log('Отзыв добавлен!')
        }
    })
    res.redirect('/review')
}

export const getDelExcPage = (req: any, res: express.Response) => {
    connection.query("SELECT * FROM `kurs`.`excursion`", (err, result) => {
        if (err) {
            console.log('Ошибка БД!', err)
        } else{
            console.log('Страница экскурсий')
            res.render('delexcursion', {
                excInf: result,
                status: req.session.status,
                status_admin: req.session.status_admin
            })
        }
    })
}

export const postDelExc = (req: any, res: express.Response) => {
    console.log(req.session);
    connection.query("DELETE FROM `kurs`.`excursion` WHERE id=?", [req.body.excId], (err, result) => {
        if (err) {
            console.log('Ошибка БД!', err)
        }else {
            console.log("Экскурия удалена")
        }
    })
    res.render('delexcursion')
}