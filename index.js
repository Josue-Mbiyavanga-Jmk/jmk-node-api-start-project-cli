//import
const runCmd = require('./executeCmd');
const { runFileCreator, runNextVersion } = require('./fileCreator');


//
const generateProject = (answers) => {
    console.log(`⏳ Génération du projet en cours...`);
    //les choix de l'utilisateur
    let framework, typeFramework = 0;
    let bd, typeBd = 0;
    let file = false;
    //les utilitaires

    //test du framework choisi
    if (answers.framework == 'Express') {
        framework = 'express';
    }
    else {
        framework = 'fastify';
        typeFramework = 1;
    }
    //test de la bd choisie
    if (answers.bd == 'MySQL') {
        bd = 'mysql2'; //on utilise mysql2-promise
        typeBd = 0;
    }
    else if (answers.bd == 'Postgres') {
        bd = 'pg';
        typeBd = 1;
    }
    else if (answers.bd == 'MongoBD') {
        bd = 'mongoose';
        typeBd = 2;
    }

    //test de la creation des fichiers modèles
    if (answers.file) {
        file = true;
    }
    //Exécution des dépendances : pour express
    if (typeFramework === 0) {
        //
        runCmd('npm', ['init', '-y'], { shell: true });
        runCmd('npm', ['install', framework, bd, 'cors', 'dotenv', 'helmet', 'path'], { shell: true });
        //Exécution de dossiers 
        runFileCreator(file, typeBd);
        console.info(typeFramework)
    }
    else {
        // on va mettre pour fastify
        runNextVersion();
        console.info(typeFramework)

    }



}






module.exports = {
    generateProject
}