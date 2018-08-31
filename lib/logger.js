(function(){
    'use strict';

    const chalk = require('chalk');
    const _pre = "[SMARTH]"

    module.exports.warn = (message) => {
        console.log(chalk.yellow(`${_pre} ${message}`));
    }

    module.exports.error = (message) => {
        console.log(chalk.red(`${_pre} ${message}`));
    }

    module.exports.log = (message) => {
        console.log(chalk.white(`${_pre} ${message}`));
    }

    module.exports.info = (message) => {
        console.log(chalk.green(`${_pre} ${message}`));
    }

    module.exports.debug = (message) => {
        console.log(chalk.blue(`${_pre} ${message}`));
    }

}).call(this);