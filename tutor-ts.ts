#!/usr/bin/env node
import program = require('commander');

import {Commands} from './src/controllers/commands';
const nunjucks = require('nunjucks');
const root = __dirname;
nunjucks.configure(root + '/src/views', {autoescape: false});
nunjucks.installJinjaCompat();

const commands = new Commands(root);
commands.exec();
