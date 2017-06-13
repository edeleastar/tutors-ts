import {LearningObject} from './learningobjects';
import {readFile} from '../utils/futils';

export class Video extends LearningObject {
  videoid: string;

  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'huge film';
    super.reap('video');
    this.videoid = readFile('videoid');
  }

  publish(path: string): void {
  }
}
