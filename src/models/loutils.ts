import * as fs from 'fs';
const glob = require('glob');
import * as sh from 'shelljs';
import {  LearningObject } from './learningobjects';
import { Course } from './course';
import { Topic } from './topic';
import { Book } from './book';
import { writeFile } from '../utils/futils';
import { Video } from './video';
import { Git } from './git';
import {Archive, Talk} from './discrete-learningobject';
const nunjucks = require('nunjucks');

export function reapLos(parent: LearningObject): Array<LearningObject> {
  let los: Array<LearningObject> = reapLoType('course*', parent, folder => {
    return new Course(undefined, parent);
  });
  los = los.concat(
    reapLoType('topic*', parent, parent => {
      return new Topic(parent);
    }),
  );
  los = los.concat(
    reapLoType('talk*', parent, parent => {
      return new Talk(parent);
    }),
  );
  los = los.concat(
    reapLoType('book*', parent, parent => {
      return new Book(parent);
    }),
  );
  los = los.concat(
    reapLoType('video*', parent, parent => {
      return new Video(parent);
    }),
  );
  los = los.concat(
    reapLoType('archive*', parent, parent => {
      return new Archive(parent);
    }),
  );
  los = los.concat(
    reapLoType('github*', parent, parent => {
      return new Git(parent);
    }),
  );
  return los;
}

function reapLoType(
  pattern: string,
  parent: LearningObject,
  locreator: (parent: LearningObject) => LearningObject,
): Array<LearningObject> {
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

export function findLos(
  los: Array<LearningObject>,
  lotype: string,
): LearningObject[] {
  let result: LearningObject[] = [];
  los.forEach(lo => {
    if (lo.lotype === lotype) {
      result.push(lo);
    }
    if (lo instanceof Topic) {
      result = result.concat(findLos(lo.los, lotype));
    }
  });
  return result;
}

export function publishTemplate(
  path: string,
  file: string,
  template: string,
  lo: LearningObject,
): void {
  writeFile(path, file, nunjucks.render(template, { lo: lo }));
}

export function publishLos(path: string, los: Array<LearningObject>): void {
  los.forEach(lo => {
    console.log('  --> ', lo.title);
    lo.publish(path);
  });
}

export function copyResource(src: string, dest: string): void {
  dest = dest + '/' + src;
  sh.mkdir('-p', dest);
  sh.cp('-rf', src + '/*.pdf', dest);
  sh.cp('-rf', src + '/*.zip', dest);
  sh.cp('-rf', src + '/*.png', dest);
  sh.cp('-rf', src + '/*.jpg', dest);
  sh.cp('-rf', src + '/*.jpeg', dest);
  sh.cp('-rf', src + '/*.gif', dest);
}
