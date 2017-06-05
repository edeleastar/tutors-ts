import * as fs from 'fs';
const glob = require('glob');
import * as sh from 'shelljs';
import {CompositeLearningObject, LearningObject} from './learningobjects';
import {Course} from './course';
import {Topic} from './topic';
import {Talk} from './talk';
import {Book} from './book';
import {writeFile} from '../utils/futils';
import {Video} from './video';
import {Portfolio} from './portfolio';
const nunjucks = require('nunjucks');

export function reapLos(parent: LearningObject): Array<LearningObject> {
  let los: Array<LearningObject> = reapLoType('course*', parent, folder => {
    return new Course(parent);
  });

  los = los.concat(reapLoType('topic*', parent, parent => {
    return new Topic(parent);
  }));
  los = los.concat(reapLoType('talk*', parent, parent => {
    return new Talk(parent);
  }));
  los = los.concat(reapLoType('book*', parent, parent => {
    return new Book(parent);
  }));
  los = los.concat(reapLoType('video*', parent, parent => {
    return new Video(parent);
  }));
  return los;
}

function reapLoType(pattern: string, parent: LearningObject, locreator: (parent: LearningObject) => LearningObject): Array<LearningObject> {
  const los: Array<LearningObject> = [];
  const folders = glob.sync(pattern).sort();
  for (let folder of folders) {
    if (fs.lstatSync(folder).isDirectory()) {
      sh.cd(folder);
      const lo = locreator(parent);
      los.push(lo);
      sh.cd('..');
    }
  }
  return los;
}

export function publishTemplate(path: string, file: string, template: string, lo: LearningObject): void {
  writeFile(path, file, nunjucks.render(template, lo));
}

export function publishLos(path: string, los: Array<LearningObject>): void {
  los.forEach(lo => {
    console.log('  -->', lo.title);
    lo.publish(path);
  });
}

export function createRoot(): CompositeLearningObject | null {
  if (fs.existsSync('portfolio.yaml')) {
    return new Portfolio();
  } else if (fs.existsSync('course.md')) {
    return new Course();
  }
  return null;
}
