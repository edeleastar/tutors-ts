import program = require('commander');
import * as fs from 'fs';
import * as sh from 'shelljs';
import { ExecOutputReturnValue } from 'shelljs';

function generateCourseFolderNames(): string[] {
  const remoteRepoPartial = 'tutors-starter-';
  let i = 0;
  const allCourseNames = [];
  let freeNameFound = false;
  while (!freeNameFound) {
    const courseName = `${remoteRepoPartial}${i}`;
    if (fs.existsSync(courseName)) {
      i++;
    } else {
      freeNameFound = true;
    }

    allCourseNames.push(courseName);
  }
  return allCourseNames;
}

function updateYaml(folderNames: string[]): void {
  let yaml = `
title: 'A collection of recent Modules in Modern Computer Science'
credits: 'Department of Computing & Mathematics, WIT'
courseGroups:
  - title: 'Module Group Label'
    modules:
`;
  for (const folder of folderNames) {
    yaml += `      - ${folder}
`;
  }
  fs.writeFileSync('portfolio.yaml', yaml);
}

export function newCommand(): void {
  console.log('Creating new template course...');
  const courseFolderNames = generateCourseFolderNames();
  const folder = courseFolderNames[courseFolderNames.length - 1];
  updateYaml(courseFolderNames);
  const retVal = sh.exec(
    `git clone https://github.com/wit-tutors/tutors-starter.git ${folder}`,
    { silent: false },
  ) as ExecOutputReturnValue;
  if (retVal.code !== 0) {
    console.log('fix this and try again?');
  }

  console.log('Next steps...');
  console.log(`cd into ${folder} and run "tutors" again`);
  console.log(
    'This will generate the course web in "tutors-starter/public-site"',
  );
}
