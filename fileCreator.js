//
const fs = require('fs');
const chalk = require('chalk');
//
function runFileCreator(isCreateFile, typeBd) {
    //les couches
    const modelFolderName = './model';
    const daoFolderName = './dao';
    const serviceFolderName = './service';
    const routingFolderName = './routing';
    const wwwFolderName = './www';
    const dbFolderName = './configdb';
    //les data
    let dataModel;
    let dataDao;
    let dataService;
    let dataRouting;
    let dataWww;
    let dataDbConfig;
    let dataEnv;
    let dbport;

    try {
        //couche dbconfig
        if (!fs.existsSync(dbFolderName)) {
            fs.mkdirSync(dbFolderName); //creation dossier
            //on test le droit de créer des fichiers models
            if (isCreateFile) {
                //on test le type de SGBD
                if (typeBd === 0) {
                    //pour mysql
                    dataDbConfig = ' const mysql = require(\'mysql2/promise\');\n const pool = mysql.createPool({ \n port:process.env.DB_PORT, \n host: process.env.DB_HOST, \n  user: process.env.DB_USER, \n password:process.env.DB_PASSWORD, \n database: process.env.DB_NAME, \n waitForConnections: true, \n connectionLimit: 10, \n queueLimit: 0 \n }); \n module.exports = {pool} ';
                    dbport = 3306;
                }
                else if (typeBd === 1) {
                    //pour postgres
                    dataDbConfig = ' const Pool = require(\'pg\').Pool;\n var pool; \n function singleConnectionToDatabase() { \n if (!pool) { \n pool = new Pool({ \n user: process.env.DB_USER, \n host: process.env.DB_HOST, \n  database: process.env.DB_NAME, \n password:process.env.DB_PASSWORD, \n port: process.env.DB_PORT , \n pool:{max:5,min: 0,acquire: 30000,idle: 10000} \n }) \n } \n return pool; \n } \n const myPool = singleConnectionToDatabase(); \n module.exports = { queryng: (text, params) => myPool.query(text, params) } ';
                    dbport = 5432;
                }
                else if (typeBd === 2) {
                    //pour mongobd
                    dataDbConfig = ' let mongoose = require(\'mongoose\'); \n exports.mongoose=mongoose; \n';
                    dbport = 27017;
                }
                fs.writeFileSync('./configdb/database.txt', dataDbConfig, {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
                fs.renameSync('./configdb/database.txt', './configdb/database.js');
            }
            //console.log('File is created successfully.');
            console.log(chalk.greenBright("Dossier configdb crée avec succès."));


        }
        else {
            console.log(chalk.yellowBright("Dossier configdb existe déjà."));

        }
        //couche model
        if (!fs.existsSync(modelFolderName)) {
            fs.mkdirSync(modelFolderName); //creation dossier
            //on test le droit de créer des fichiers models
            if (isCreateFile) {
                //on test le type de SGBD
                if (typeBd === 0) {
                    //pour mysql
                    dataModel = ' require("dotenv").config();\n class Example {\n constructor(id,name){\n this.id = id; \n this.name = name; \n } \n } \n  const query_add = "insert into tb_example (name) values(?)"; \n  const query_all = "select * from tb_example "; \n const query_get ="select * from tb_example where id = ? "; \n const query_update ="update tb_example where id = ? "; \n const query_delete ="delete from tb_example where id = ? "; \n module.exports = {query_add, query_all, query_get, query_update, query_delete} ';
                }
                else if (typeBd === 1) {
                    //pour postgres
                    dataModel = ' require("dotenv").config();\n class Example {\n constructor(id,name){\n this.id = id; \n this.name = name; \n } \n } \n  const query_add = "insert into tb_example (name) values($1) returning * "; \n  const query_all = "select * from tb_example "; \n const query_get ="select * from tb_example where id = $1 "; \n const query_update ="update tb_example where id = $1 returning * "; \n const query_delete ="delete from tb_example where id = $1 returning *"; \n module.exports = {query_add, query_all, query_get, query_update, query_delete} ';
                }
                else if (typeBd === 2) {
                    //pour mongobd
                    dataModel = 'const mongoose = require(\'mongoose\'); \n const exampleSchema = mongoose.Schema({ \n name: { type: String } \n }); \n module.exports = mongoose.model(\'Example\', exampleSchema); ';
                }
                fs.writeFileSync('./model/exampleModel.txt', dataModel, {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
                fs.renameSync('./model/exampleModel.txt', './model/exampleModel.js');
            }
            //console.log('File is created successfully.');
            console.log(chalk.greenBright("Dossier model crée avec succès."));


        }
        else {
            console.log(chalk.yellowBright("Dossier model existe déjà."));

        }

        //couche dao
        if (!fs.existsSync(daoFolderName)) {
            fs.mkdirSync(daoFolderName); //creation dossier
            //on test le droit de créer des fichiers models
            if (isCreateFile) {
                //on test le type de SGBD
                if (typeBd === 0) {
                    //pour mysql
                    dataDao = ' const {pool}= require("../dbconfig/database"); \n const model = require("../model/exampleModel"); \n module.exports = {\n add :async function (data){\n const rows = await pool.query(model.query_add, [data.name]); \n if(rows[0].insertId < 0){\n return 205; \n} \nconst rows_returned  = await pool.query(model.query_get, [rows[0].insertId]); \n return rows_returned[0][0]; \n }, \n getAll :async function (){ \n const rows  = await pool.query(model.query_all, []); \n  return rows[0]; \n }, \n getById :async function (id){ \n const rows  = await pool.query(model.query_get, [id]); \n if (rows[0].length < 1) { \n return 205; \n } \n return rows[0][0]; \n }, \n update :async function (data){\n const rows  = await pool.query(model.query_update,[data.name,data.id]); \n if(rows[0].affectedRows === 0){\n return 205; \n } \n return 200; \n },\n delete :async function (id){\n const rows  = await pool.query(model.query_delete, [id]); \n if(rows[0].affectedRows === 0){\n return 205; \n } \n return 200; \n } \n } ';
                }
                else if (typeBd === 1) {
                    //pour postgres
                    dataDao = 'const db = require("../dbconfig/database"); const model = require("../model/exampleModel"); \n module.exports = {\n add :async function (data){\n const {rows} = await db.queryng(model.query_add, [data.name]); \n if(rows.length === 0){ \n return 205; \n } \n return rows[0]; \n },\n getAll :async function (){ \n const {rows}  = await db.queryng(model.query_all, []); \n if(rows.length === 0){ \n return 205; \n } return rows; \n }, \n getById :async function (id){ \n const {rows}  = await db.queryng(model.query_get, [id]); \n if (rows.length < 1) { \n return 205; \n } \n return rows[0]; \n }, \n update :async function (data){\n const {rows}  = await db.queryng(model.query_update,[data.name,data.id]); \n if(rows.length < 1){\n return 205; \n } \n return rows[0]; \n },\n delete :async function (id){\n const {rows} = await db.queryng(model.query_delete, [id]); \n if(rows.length < 1){\n return 205; \n } \n return rows[0]; \n } \n }';
                }
                else if (typeBd === 2) {
                    //pour mongobd
                    dataDao = ' const Example = require("../model/exampleModel"); \n module.exports = {\n  add :async function (data){\n  const createExample = await Example.create(data) ; \n return createExample; \n }, \n getAll : async function(){\n const allExamples = await Example.find(); \n return allExamples; \n }, \n getById :async function (_id){ \n const returnedExample = await Example.findById(_id); \n return returnedExample; \n }, \n update :async function (data){\n const updateExample = await Example.updateOne({ _id: data._id },data).exec(); \n if(updateExample.nModified === 0){ \n return 205; \n } \n return 200; \n }, \n delete :async function (_id){\n const deletedExample = await Example.deleteOne({ _id: _id }).exec(); \n if(deletedExample.deletedCount === 0){\n return 205; \n }\n return 200; \n } \n }';
                }
                fs.writeFileSync('./dao/exampleDao.txt', dataDao, {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
                fs.renameSync('./dao/exampleDao.txt', './dao/exampleDao.js');
            }
            //console.log('File is created successfully.');
            console.log(chalk.greenBright("Dossier dao crée avec succès."));


        }
        else {
            console.log(chalk.yellowBright("Dossier dao existe déjà."));

        }

        //couche service
        if (!fs.existsSync(serviceFolderName)) {
            fs.mkdirSync(serviceFolderName); //creation dossier
            //on test le droit de créer des fichiers models
            if (isCreateFile) {
                //on test le type de SGBD
                if (typeBd === 0) {
                    //pour mysql : 
                    dataService = ' const dao = require("../dao/exampleDao"); \n const model = require("../model/exampleModel"); \n module.exports = { \n addExample  : async (req,res)=>{\n try {\n let example = req.body.example; \n let anExample=JSON.parse(example); \n const result = await dao.add(anExample); \n if(result===205){\n const response = { status: 205, message:"Echec insertion"}; \n return res.json(response); \n }\n else{\n const response = {status: 200,data:result}; \n return res.json(response); \n } \n }\n catch (error) { \n const response = { status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n }, \n allExample: async (req,res)=>{\n try{ \n const result = await dao.getAll(); \n const response = {status: 200,data:result}; \n return res.json(response); \n } \n  catch (error) {\n const response = {status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n }, \n oneExample : async (req,res)=>{\n try{ \n let id = req.body.id; \n const result = await dao.getById(id); \n if(result===205){\n const response = { status: 404,  message:"Example not found"}; \n return res.json(response); \n } \n else{\n const response = { status: 200, data:result};\n return res.json(response);\n } \n }\n  catch (error) {\n const response = {status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n }, \n updateExample  : async (req,res)=>{ \n try { \n   let example= req.body.example; \n let anExample=JSON.parse(example); \n const result = await dao.update(anExample); \n if(result===205){ \n const response = { status: 205,  message:"Echec de mise à jour"}; \n return res.json(response); \n } else{ \n const response = { status: 200, result:result}; \n return res.json(response); \n } \n } catch (error) { \n const response = { status: 500, message:"Erreur du coté serveur survenue"}; \n return res.json(response); \n } \n }, \n deleteExample  : async (req,res)=>{ \n try { \n   let id= req.body.id; \n const result = await dao.delete(id); \n if(result===205){ \n const response = { status: 205,  message:"Echec de suppression"}; \n return res.json(response); \n } else{ \n const response = { status: 200, result:result}; \n return res.json(response); \n } \n } catch (error) { \n const response = { status: 500, message:"Erreur du coté serveur survenue"}; \n return res.json(response); \n } \n } \n  } ';
                }
                else if (typeBd === 1) {
                    //pour postgres
                    dataService = ' const dao = require("../dao/exampleDao"); \n const model = require("../model/exampleModel"); \n module.exports = { \n addExample  : async (req,res)=>{\n try {\n let example = req.body.example; \n let anExample=JSON.parse(example); \n const result = await dao.add(anExample); \n if(result===205){\n const response = { status: 205, message:"Echec insertion"}; \n return res.json(response); \n }\n else{\n const response = {status: 200,data:result}; \n return res.json(response); \n } \n }\n catch (error) { \n const response = { status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n }, \n allExample: async (req,res)=>{\n try{ \n const result = await dao.getAll(); \n if(result===205){\n const response = {status:205, message:"aucun element trouvé"}; \n return res.json(response); \n } \n const response = {status: 200,data:result}; \n return res.json(response); \n } \n  catch (error) {\n const response = {status: 500,message:"Problème survenu pendant l\'exécution"}; \n res.json(response); \n } \n }, \n oneExample : async (req,res)=>{\n try{ \n let id = req.body.id; \n const result = await dao.getById(id); \n if(result===205){\n const response = { status: 404,  message:"Example not found"}; \n return res.json(response); \n } \n else{\n const response = { status: 200, data:result};\n return res.json(response);\n } \n }\n  catch (error) {\n const response = {status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n }, \n updateExample  : async (req,res)=>{ \n try { \n   let example= req.body.example; \n let anExample=JSON.parse(example); \n const result = await dao.update(anExample); \n if(result===205){ \n const response = { status: 205,  message:"Echec de mise à jour"}; \n return res.json(response); \n } else{ \n const response = { status: 200, result:result}; \n return res.json(response); \n } \n } catch (error) { \n const response = { status: 500, message:"Erreur du coté serveur survenue"}; \n return res.json(response); \n } \n }, \n deleteExample  : async (req,res)=>{ \n try { \n   let id= req.body.id; \n const result = await dao.delete(id); \n if(result===205){ \n const response = { status: 205,  message:"Echec de suppression"}; \n return res.json(response); \n } else{ \n const response = { status: 200, result:result}; \n return res.json(response); \n } \n } catch (error) { \n const response = { status: 500, message:"Erreur du coté serveur survenue"}; \n return res.json(response); \n } \n } \n  } ';
                }
                else if (typeBd === 2) {
                    //pour mongobd
                    dataService = ' const dao = require("../dao/exampleDao"); \n const model = require("../model/exampleModel"); \n module.exports = { \n addExample  : async (req,res)=>{\n try {\n let example = req.body.example; \n let anExample=JSON.parse(example); \n const result = await dao.add(anExample); \n const response = {status: 200,data:result}; \n return res.json(response); \n }\n catch (error) { \n const response = { status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n }, \n allExample: async (req,res)=>{\n try{ \n const result = await dao.getAll(); \n const response = {status: 200,data:result}; \n return res.json(response); \n }\n catch (error) { \n const response = { status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n }, \n oneExample: async (req,res)=>{\n try{ \n let _id = req.body._id; \n const result = await dao.getById(_id); \n const response = {status: 200,data:result}; \n return res.json(response); \n }\n catch (error) { \n const response = { status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n }, \n updateExample: async (req,res)=>{\n try{ \n let example = req.body.example; \n let anExample = JSON.parse(example); \n const result = await dao.update(anExample); \n const response = {status: result}; \n return res.json(response); \n }\n catch (error) { \n const response = { status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n }, \n deleteExample: async (req,res)=>{\n try{ \n let _id = req.body._id; \n const result = await dao.delete(_id); \n const response = {status: result}; \n return res.json(response); \n }\n catch (error) { \n const response = { status: 500,message:"Problème survenu pendant l\'exécution"}; \n return res.json(response); \n } \n } \n }';
                }
                fs.writeFileSync('./service/exampleService.txt', dataService, {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
                fs.renameSync('./service/exampleService.txt', './service/exampleService.js');
            }
            //console.log('File is created successfully.');
            console.log(chalk.greenBright("Dossier service crée avec succès."));


        }
        else {
            console.log(chalk.yellowBright("Dossier service existe déjà."));

        }

        //couche routing
        if (!fs.existsSync(routingFolderName)) {
            fs.mkdirSync(routingFolderName); //creation dossier
            //on test le droit de créer des fichiers models
            if (isCreateFile) {
                //pas de test du type de SGBD
                dataRouting = 'router = express.Router(); \n const service = require(\'../service/ExampleService\'); \n router.post(\'/v1/add\', service.addExample);\n router.get(\'/v1/getAll\', service.allExample); \n router.post(\'/v1/getById\', service.oneExample);\n router.post(\'/v1/update\', service.updateExample);\n router.post(\'/v1/delete\', service.deleteExample);\n module.exports = router; ';
                //création du fichier utilisateur
                fs.writeFileSync('./routing/exampleRouter.txt', dataRouting, {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
                fs.renameSync('./routing/exampleRouter.txt', './routing/exampleRouter.js');
                //creation des fichiers par défaut
                const dataMainRooter = 'const homepage=require("./homeRouter"); \n const example=require("./exampleRouter"); \n app.use(\'/\', homepage); \n app.use(\'/\', \'/api/example\', example);';
                const dataHomeRooter = ' router = express.Router(); \n router.get(\'/\', function(req,res){ \n return res.status(200).send({ \n message: "Merci. Contactez le développeur." \n }); \n }); \n module.exports = router; \n ';

                fs.writeFileSync('./routing/homeRouter.txt', dataHomeRooter, {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
                fs.renameSync('./routing/homeRouter.txt', './routing/homeRouter.js');

                fs.writeFileSync('./routing/mainRouter.txt', dataMainRooter, {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
                fs.renameSync('./routing/mainRouter.txt', './routing/mainRouter.js');

            }
            //console.log('File is created successfully.');
            console.log(chalk.greenBright("Dossier routing crée avec succès."));


        }
        else {
            console.log(chalk.yellowBright("Dossier routing existe déjà."));

        }

        //couche www
        if (!fs.existsSync(wwwFolderName)) {
            fs.mkdirSync(wwwFolderName); //creation dossier
            //on test le droit de créer des fichiers models
            if (isCreateFile) {
                //pas de test du type de SGBD
                if (typeBd === 2) {
                    dataWww = ' require("dotenv").config(); \n express = require(\'express\'); \n var helmet = require(\'helmet\');\n var cors = require(\'cors\'); var mongoose = require(\'../configdb/database\').mongoose; \n mongoose.Promise = global.Promise; \n const db = mongoose.connect(process.env.DATABASE_URL_LOCAL, {\n useNewUrlParser: true, useUnifiedTopology: true \n }); \n app = express();\n app.use(helmet());\n app.use(cors());\n app.use(express.json()); \n app.set("port", process.env.APP_PORT);\n app.set("ipaddr",process.env.IP); \n server = require("http").createServer(app); \n require(\'../rooting/mainRouter\'); ';
                }
                else {
                    dataWww = ' require("dotenv").config(); \n express = require(\'express\'); \n var helmet = require(\'helmet\');\n var cors = require(\'cors\');\n app = express();\n app.use(helmet());\n app.use(cors());\n app.use(express.json()); \n app.set("port", process.env.APP_PORT);\n app.set("ipaddr",process.env.IP); \n server = require("http").createServer(app); \n require(\'../rooting/mainRouter\'); ';
                }
                fs.writeFileSync('./www/mainserver.txt', dataWww, {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
                fs.renameSync('./www/mainserver.txt', './www/mainserver.js');
            }
            //console.log('File is created successfully.');
            console.log(chalk.greenBright("Dossier www crée avec succès."));


        }
        else {
            console.log(chalk.yellowBright("Dossier www existe déjà."));

        }

        //maintenant il faut créer le fichier serveur et .env
        const dataServer = 'pathDir = require("path"); \n global.appRoot = pathDir.resolve(__dirname); \n require(\'./www/mainserver\'); \n server.listen(process.env.APP_PORT, function (){\n console.log(\'server écoute sur  IP: \' + app.get(\'ipaddr\') + \' et port (HTTP) \' + app.get(\'port\') ); \n } \n ); ';
        fs.writeFileSync('./server.txt', dataServer, {
            encoding: "utf8",
            flag: "a+",
            mode: 0o666
        });
        fs.renameSync('./server.txt', './server.js');
        if (typeBd === 2) {
            dataEnv = ' APP_PORT = 8085 \n IP=0.0.0.0 \n DATABASE_URL_LOCAL = mongodb://localhost:' + dbport + '/dbname';
        }
        else {
            dataEnv = ' APP_PORT = 8085 \n IP=0.0.0.0 \n DB_PORT =' + dbport + '\n DB_HOST = localhost\n DB_USER = root \n DB_PASSWORD = \'\' \n DB_NAME = db_name \n ';
        }

        fs.writeFileSync('./env.txt', dataEnv, {
            encoding: "utf8",
            flag: "a+",
            mode: 0o666
        });
        fs.renameSync('./env.txt', './.env');

        //on termine
        //process.exit(0);


    } catch (err) {
        console.error(err);
        console.log(chalk.red("Dossier non crée."));
        process.exit(0);
    }
}

function runNextVersion() {
    //console.log('File is created successfully.');
    console.log(chalk.redBright("Désolé, les fonctionnalités pour le framework") + " " + chalk.greenBright("Fastify") + " " + chalk.redBright("sera disponile à la prochaine version."));
    process.exit(0);
}

module.exports = { runFileCreator, runNextVersion };
