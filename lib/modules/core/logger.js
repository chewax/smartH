(function(){
    'use strict';

    const chalk = require('chalk');
    const figures = require('figures');
    const moment = require('moment');
    const fs = require('fs');
    const logstream = fs.createWriteStream( `${__dirname}/smart.log`, {flags:'a'});

    const TYPE_ICONS = {
        info: figures.info,
        success: figures.tick,
        debug: figures.pointer,
        trace: figures.pointer,
        error: figures.cross,
        warn: figures.warning,
        log: ' '
      }

    process.on('exit', (code) => {
        logstream.end();
    });

    module.exports.error = (msg) => {
        let fmsg = format(TYPE_ICONS.error, msg);
        console.log(chalk.red(fmsg));
        logstream.write(fmsg + "\n"); 
    }

    module.exports.warn = (msg) => {
        let fmsg = format(TYPE_ICONS.warn, msg);
        console.log(chalk.orange(fmsg));
        logstream.write(fmsg + "\n"); 
    }

    module.exports.log = (msg) => {
        let fmsg = format(TYPE_ICONS.log, msg);
        console.log(chalk.magenta(fmsg));
        logstream.write(fmsg + "\n"); 
    }

    module.exports.info = (msg) => {
        let fmsg = format(TYPE_ICONS.info, msg);
        console.log(chalk.cyan(fmsg));
        logstream.write(fmsg + "\n");
    }

    module.exports.success = (msg) => {
        let fmsg = format(TYPE_ICONS.success, msg);
        console.log(chalk.green(fmsg));
        logstream.write(fmsg + "\n"); 
    }

    module.exports.debug = (msg) => {
        let fmsg = format(TYPE_ICONS.trace, msg);
        console.log(chalk.yellow(fmsg));
        //Dont send to file debug messages
    }

    module.exports.trace = (msg) => {
        let fmsg = format(TYPE_ICONS.debug, msg);
        console.log(chalk.white(fmsg));
        logstream.write(fmsg + "\n"); 
    }


    function format (icon, msg) {
        return `${icon} ${timpestamp()} ${msg}`;
    }

    function timpestamp () {
        return moment().format('DD/MMM/YYYY:kk:mm:ss');
    }


}).call(this);