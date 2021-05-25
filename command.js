#!/usr/bin/env node
//cette ligne au-dessus doit toujours etre là pour harmoniser l'environnement
//import de commander
const program = require('commander');
//import de l'invite interactif
const { prompt } = require('inquirer');
//import des utilitaires pour le lancement
const chalk = require('chalk'); //coloration des ecrits
const clear = require('clear'); // effacer l'ecran
const figlet = require('figlet'); //ecriture stylisé.
//import des fonction des operation à la db
const { generateProject } = require('./index');
//on essaie de lancer magnifiquement le cli
clear(); //effacer l'ecran
//ecrire sur la console une banière
console.log(
    chalk.yellowBright(
        figlet.textSync('JMK@', { horizontalLayout: 'full' })
    )
);
console.log(
    'Bienvenu.e dans le ' + chalk.greenBright('CLI') + ' de génération de projet des' + chalk.greenBright(' API REST') + ' avec Node.js pour les dev d\'' + chalk.greenBright('iduyatech.')
);

//on initialise le program de commander
program
    .version('1.0.0')
    .description('le CLI qui permet d\'avoir un projet node.js pret à utiliser pour les dev de iduyatech')

//question pour l'action 1
const startQuestions = [
    {
        type: 'list',
        name: 'framework',
        message: 'Quel votre framework ?',
        choices: ['Express', 'Fastify']
    },
    {
        type: 'rawlist',
        name: 'bd',
        message: 'Quel est votre BD ?',
        choices: ['MySQL', 'Postgres', 'MongoBD'],
        when: a => a.framework == 'Express'
    },
    {
        type: 'confirm', //pour confirmer par yes ou no
        message: 'Voulez-vous un fichier type pour chaque couche de base ?',
        default: true, //déjà à yes au depart
        name: 'file',
        when: a => a.framework == 'Express'
    }
];

//add command : première action
program
    .command('run') //la commande
    .alias('r') // le diminutif de la commande
    .description('Lancement de la génération du projet') //la description de la commande
    .action(() => {
        //on forme avec les réponses aux question l'objet et on envoi dans la fonction 
        //pour insertion dans la db
        prompt(startQuestions).then(answers => generateProject(answers));

    });


//toujours à la fin
program.parse(process.argv);