#!/usr/bin/env node

import program = require('commander');

import * as fs from 'fs';
const nunjucks = require('nunjucks');

import {createRoot} from './models/loutils';

const root = __dirname;
nunjucks.configure(root + '/views', {autoescape: false});
nunjucks.installJinjaCompat();

program.arguments('<file>')
    .version(require('./package.json').version)
    .parse(process.argv);

let rootLearnongObject = createRoot();

if (rootLearnongObject) {
  rootLearnongObject.publish('public-site');
} else {
  console.log('Course or Portfolio not found');
}

