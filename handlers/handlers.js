"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var connection = mysql_1.default.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'qwerty3129',
    database: 'kurs'
});
exports.getMainPage = function (req, res) {
    res.render('index', {
        status: req.session.status
    });
};
exports.getRegPage = function (req, res) {
    res.render('registration');
};
exports.getVhodPage = function (req, res) {
    res.render('vhod');
};
exports.getExit = function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
};
exports.getUserPage = function (req, res) {
    connection.query("SELECT * FROM kurs.ord_exc INNER JOIN kurs.order ON order_id = id INNER JOIN kurs.excursion ON excursion_id = kurs.excursion.id WHERE client_id = ?", [req.session.client_id], function (err, result) {
        if (err) {
            console.log('Ошибка БД!', err);
        }
        else {
            console.log(result);
            res.render('user', {
                chosenExc: req.session.chosenExc,
                ordOrd: result
            });
        }
    });
};
exports.postReg = function (req, res) {
    connection.query("INSERT INTO `kurs`.`client` (`name`, `login`, `password`, `email`) VALUES (?, ?, ?, ?)", [req.body.fullname, req.body.login, req.body.password, req.body.email], function (err) {
        if (err) {
            console.log('Ошибка БД!', err);
        }
        else {
            console.log('Пользователь зарегестрирован!');
        }
    });
    res.redirect('/user');
};
exports.postLogin = function (req, res) {
    connection.query("SELECT * FROM `kurs`.`client` WHERE login = ? AND password = ?", [req.body.login, req.body.password], function (err, result) {
        if (err) {
            console.log('Ошибка БД!', err);
        }
        if (result.length) {
            console.log('Пользователь вошел!'),
                req.session.status = true;
            req.session.client_id = result[0].id;
            req.session.chosenExc = [];
            res.redirect('/user');
        }
        else {
            res.send('Пользователя не существует');
        }
    });
};
exports.getExcursionPage = function (req, res) {
    connection.query("SELECT * FROM `kurs`.`excursion`", function (err, result) {
        if (err) {
            console.log('Ошибка БД!', err);
        }
        else {
            console.log('Страница экскурсий');
            res.render('excursion', {
                excInf: result,
                status: req.session.status,
                status_admin: req.session.status_admin
            });
        }
    });
};
exports.postExcursion = function (req, res) {
    var exc = {
        id: req.body.excId,
        name: req.body.excName,
        date: req.body.excDate,
        cost: req.body.excCost
    };
    req.session.chosenExc.push(exc);
    console.log(req.session.chosenExc);
    res.redirect('/excursion');
};
exports.getReviewPage = function (req, res) {
    connection.query("SELECT review.id, description, name, login FROM kurs.review INNER JOIN `client` ON client.id = review.client_id ", function (err, result) {
        if (err) {
            console.log('Ошибка БД!', err);
        }
        else {
            console.log('Отзывы', result);
            res.render('review', {
                revInf: result,
                status: req.session.status,
                status_admin: req.session.status_admin
            });
        }
    });
};
exports.getAddRevPage = function (req, res) {
    res.render('addreview');
};
exports.getAdminLogin = function (req, res) {
    res.render('adminLogin');
};
exports.postAdmin = function (req, res) {
    connection.query("SELECT * FROM `kurs`.`admin` WHERE login = ? AND password = ?", [req.body.login, req.body.password], function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result.length) {
            console.log('Админ вошел!');
            req.session.status_admin = true;
            req.session.chosenExc = [];
            res.redirect('/adminPage');
        }
    });
};
exports.getAdminPage = function (req, res) {
    console.log(req.session.chosenExc);
    res.render('adminPage', {
        chosenExc: req.session.chosenExc
    });
};
exports.postAddOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var costArr_1, reducer, fullCost;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.session.chosenExc.length === 0)) return [3 /*break*/, 1];
                console.log('Не выбран заказ');
                res.redirect('excursion');
                return [3 /*break*/, 4];
            case 1:
                costArr_1 = [];
                reducer = function (accumulator, currentValue) { return accumulator + currentValue; };
                req.session.chosenExc.forEach(function (element) {
                    for (var key in element) {
                        if (key === 'cost') {
                            costArr_1.push(parseInt(element[key]));
                        }
                    }
                });
                fullCost = costArr_1.reduce(reducer);
                return [4 /*yield*/, connection.query("INSERT INTO `kurs`.`order` (`client_id`, `fullcost`) VALUES ('?', '?');", [req.session.client_id, fullCost], function (error) {
                        if (error) {
                            console.log('Ошибка БД!', error);
                        }
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, connection.query("SELECT * FROM `order` WHERE id=(SELECT MAX(id) FROM `order`)", function (err1, result) {
                        if (err1) {
                            console.log('Ошибка БД');
                        }
                        else {
                            req.session.chosenExc.forEach(function (element) {
                                connection.query("INSERT INTO `kurs`.`ord_exc` (`order_id`, `excursion_id`) VALUES (?, ?);", [result[0].id, element.id], function (err2) {
                                    if (err2) {
                                        console.log('Ошибка БД2', err2);
                                    }
                                });
                            });
                            res.send('Заказ оформлен!');
                        }
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.postClearOrder = function (req, res) {
    req.session.chosenExc = [];
    console.log('exc', req.session.chosenExc);
    res.redirect('/user');
};
exports.getAddExcPage = function (req, res) {
    console.log(req.session.chosenExc);
    res.render('addExc', {
        chosenExc: req.session.chosenExc
    });
};
exports.postAddExc = function (req, res) {
    console.log(req.session);
    connection.query("INSERT INTO `kurs`.`excursion` (`name`, `cost`, `date`, `description`) VALUES (?, ?, ?, ?)", [req.body.excursionName, req.body.excursionCost, req.body.excursionDate, req.body.excursionDesc], function (err) {
        if (err) {
            console.log('Ошибка БД!', err);
        }
        else {
            console.log('Экскурсия добавлена!');
        }
    });
    res.redirect('/excursion');
};
exports.postAddRev = function (req, res) {
    console.log(req.session);
    connection.query("INSERT INTO `kurs`.`review` (`client_id`, `description`) VALUES (?, ?)", [req.session.client_id, req.body.textreview], function (err) {
        if (err) {
            console.log('Ошибка БД!', err);
        }
        else {
            console.log('Отзыв добавлен!');
        }
    });
    res.redirect('/review');
};
exports.getDelExcPage = function (req, res) {
    connection.query("SELECT * FROM `kurs`.`excursion`", function (err, result) {
        if (err) {
            console.log('Ошибка БД!', err);
        }
        else {
            console.log('Страница экскурсий');
            res.render('delexcursion', {
                excInf: result,
                status: req.session.status,
                status_admin: req.session.status_admin
            });
        }
    });
};
exports.postDelExc = function (req, res) {
    console.log(req.session);
    connection.query("DELETE FROM `kurs`.`excursion` WHERE id=?", [req.body.excId], function (err, result) {
        if (err) {
            console.log('Ошибка БД!', err);
        }
        else {
            console.log("Экскурия удалена");
        }
    });
    res.render('delexcursion');
};
