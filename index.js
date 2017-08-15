#!/usr/bin/env node

let fs = require('fs');
let program = require('commander');
let pkg = require('./package');
let stream = undefined;
let fileValue = undefined;

program
    .version(pkg.version)
    .description(pkg.description)
    .arguments('[file.chromeless]')
    .action(function(file){
        fileValue = file;
    });
program.parse(process.argv);

if((typeof fileValue) === 'string'){
    stream = fs.createReadStream(fileValue);
}else{
    stream = process.stdin;
}

let ChromelessCLI = require('./lib/chromeless-cli');
let ccli = new ChromelessCLI(stream);
ccli.run();
