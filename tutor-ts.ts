#!/usr/bin/env node

import {Commands} from './src/controllers/commands';
const nunjucks = require('nunjucks');
const root = __dirname;
nunjucks.configure(root + '/src/views', {autoescape: false});
nunjucks.installJinjaCompat();

const commands = new Commands();
commands.exec();
