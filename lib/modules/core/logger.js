import chalk from 'chalk';
import figures from 'figures';
import moment from 'moment';
import fs from 'fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logstream = fs.createWriteStream( `${__dirname}/smart.log`, {flags:'a'});

const TYPE_ICONS = {
    info: figures.info,
    success: figures.tick,
    debug: figures.pointer,
    trace: figures.pointer,
    error: figures.cross,
    warn: figures.warning,
    log: ' '
};

process.on('exit', () => {
    logstream.end();
});

const error = (msg) => {
    let fmsg = format(TYPE_ICONS.error, msg);
    console.log(chalk.red(fmsg));
    logstream.write(fmsg + '\n'); 
};


const warn = (msg) => {
    let fmsg = format(TYPE_ICONS.warn, msg);
    console.log(chalk.orange(fmsg));
    logstream.write(fmsg + '\n'); 
};

const log = (msg) => {
    let fmsg = format(TYPE_ICONS.log, msg);
    console.log(chalk.magenta(fmsg));
    logstream.write(fmsg + '\n'); 
};

const info = (msg) => {
    let fmsg = format(TYPE_ICONS.info, msg);
    console.log(chalk.cyan(fmsg));
    logstream.write(fmsg + '\n');
};

const success = (msg) => {
    let fmsg = format(TYPE_ICONS.success, msg);
    console.log(chalk.green(fmsg));
    logstream.write(fmsg + '\n'); 
};

const debug = (msg) => {
    let fmsg = format(TYPE_ICONS.trace, msg);
    console.log(chalk.yellow(fmsg));
    //Dont send to file debug messages
};

const trace = (msg) => {
    let fmsg = format(TYPE_ICONS.debug, msg);
    console.log(chalk.white(fmsg));
    logstream.write(fmsg + '\n'); 
};


function format (icon, msg) {
    return `${icon} ${timpestamp()} ${msg}`;
}

function timpestamp () {
    return moment().format('DD/MMM/YYYY:kk:mm:ss');
}

export default {
    error, 
    warn, 
    log, 
    info, 
    success, 
    debug, 
    trace
};