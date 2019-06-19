import * as fs from 'fs';
const marked = require('../utilsjs/marked');

export function parse(fileName: string): string {
  let mdContent = '';
  if (fs.existsSync(fileName)) {
    mdContent = fs.readFileSync(fileName).toString();
  }
  return marked(mdContent);
}

export function withoutHeader(fileName: string): string {
  let content = fs.readFileSync(fileName).toString();
  const line1 = content.indexOf('\n');
  content = content.substring(line1 + 1, content.length);
  content = content.trim();
  const line2 = content.indexOf('\n');
  if (line2 > -1) {
    content = content.substring(0, line2);
  }
  return content;
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
  let array = fs
    .readFileSync(fileName)
    .toString()
    .split('\n');
  if (array[0][0] === '#') {
    header = array[0].substring(1);
  } else {
    header = array[0];
  }
  return header;
}

const replicate = function(len: number, c: string) {
  return Array(len + 1).join(c || ' ');
};

export function padRight(text: string, len: number, char: string) {
  if (text.length >= len) return text;
  return text + replicate(len - text.length, char);
}
