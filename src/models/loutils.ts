import * as fs from 'fs';
const glob = require('glob');
import * as sh from 'shelljs';
import { LearningObject } from './learningobjects';
import { Course } from './course';
import { Topic } from './topic';
import { Book } from './book';
import { writeFile } from '../utils/futils';
import { Archive, PanelTalk, Reference, Talk } from './discrete-learningobject';
import { Git, PanelVideo, Video, Web } from './web-learning-object';
import { Unit } from './unit';
const nunjucks = require('nunjucks');

export function reapLos(parent: LearningObject): Array<LearningObject> {
  let los: Array<LearningObject> = reapLoType('course*', parent, folder => {
    return new Course(undefined, parent);
  });
  los = los.concat(
    reapLoType('topic*', parent, parent => {
      return new Topic(parent);
    })
  );
  los = los.concat(
    reapLoType('unit*', parent, parent => {
      return new Unit(parent);
    })
  );
  los = los.concat(
    reapLoType('talk*', parent, parent => {
      return new Talk(parent);
    })
  );
  los = los.concat(
    reapLoType('book*', parent, parent => {
      return new Book(parent);
    })
  );
  los = los.concat(
    reapLoType('video*', parent, parent => {
      return new Video(parent);
    })
  );
  los = los.concat(
    reapLoType('panelvideo*', parent, parent => {
      return new PanelVideo(parent);
    })
  );
  los = los.concat(
    reapLoType('paneltalk*', parent, parent => {
      return new PanelTalk(parent);
    })
  );
  los = los.concat(
    reapLoType('archive*', parent, parent => {
      return new Archive(parent);
    })
  );
  los = los.concat(
    reapLoType('github*', parent, parent => {
      return new Git(parent);
    })
  );
  los = los.concat(
    reapLoType('reference*', parent, parent => {
      return new Reference(parent);
    })
  );
  los = los.concat(
    reapLoType('web*', parent, parent => {
      return new Web(parent);
    })
  );
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

export function findTopLos(los: Array<LearningObject>, lotype: string): LearningObject[] {
  let result: LearningObject[] = [];
  los.forEach(lo => {
    if (lo.lotype === lotype) {
      result.push(lo);
    }
  });
  return result;
}

export function findLos(los: Array<LearningObject>, lotype: string): LearningObject[] {
  let result: LearningObject[] = [];
  los.forEach(lo => {
    if (lo.lotype === lotype && !lo.properties!!.disable) {
      result.push(lo);
    }
    if (lo instanceof Topic) {
      result = result.concat(findLos(lo.los, lotype));
    }
  });
  return result;
}

export function findTalksWithVideos(los: Array<LearningObject>): LearningObject[] {
  let result: LearningObject[] = [];
  los.forEach(lo => {
    if (lo.lotype === 'talk') {
      const talk = lo as Talk;
      if (talk.videoid !== 'none') {
        result.push(lo);
      }
    }
    if (lo instanceof Topic) {
      result = result.concat(findTalksWithVideos(lo.los));
    }
  });
  return result;
}

export function publishTemplate(path: string, file: string, template: string, lo: any): void {
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
