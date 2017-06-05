'use strict';

import * as fs from 'fs';
import {readFile} from './futils';
const marked = require('../utilsjs/marked');

export function parse(fileName: string): string {
  const mdContent = fs.readFileSync(fileName).toString();
  return marked(mdContent);
}

export function parseWithoutHeader(fileName: string): string {
  let content = fs.readFileSync(fileName).toString();
  const line1 = content.indexOf('\n');
  content = content.substring(line1 + 1, content.length);
  content = content.trim();
  const line2 = content.indexOf('\n');
  if (line2 > -1) {
    content = content.substring(0, line2);
  }
  return marked(content);
}

export function getHeader(fileName: string): string {
  let header = '';
  let array = fs.readFileSync(fileName).toString().split('\n');
  if (array[0][0] === '#') {
    header = array[0].substring(1);
  } else {
    header = array[0];
  }
  return header;
}
