tutors-ts
=====

A static web site generator for producing course web sites from PDF, markdown and video content. For example this site here is generated using this tool.
 - <https://wit-tutors.github.io/tutors-starter-public>
 
It exhibits some of the main features of the site. Here is a portfolio of a variety of courses:
- <http://edeleastar.github.io>

Here is a complete programme (in progress):

- <https://wit-hdip-comp-sci-2018.github.io>

Here is a course on using tutors:

- <https://wit-tutors.github.io/tutors-course>

It is for a previous version - so some details have changed a little. The course was developed using tutors - the course 'source' is here:

- <https://github.com/wit-tutors/tutors-course-src>

## Quick Start

Make sure you have node.js installed. 

- <https://nodejs.org/en/>

Normally the LTS version would be the most suitable. You should also have git installed:

- <https://git-scm.com/>

Once these are installed, enter this command:

~~~
npm install tutors-ts -g
~~~

This will install the tutors command globally on your workstation. Now, to create a starter template course, enter this command:

~~~
tutors new
~~~

This will create a new course, populated with some template talks, resources and labs. To build the course, enter the following:

~~~
cd tutors-starter-0

tutors
~~~

A folder called './public-site-uk' will be generated containing a html site of the course.

You could also identify a course this portfolio:

- <http://edeleastar.github.io>

The source repos for the above courses are here:

- <https://github.com/edeleastar-portfolio>

Any repo with a 'src' suffix is a 'source' repo for tutors-ts. If you clone it and run `tutors-ts' in the cloned folder the site will be generated in 'public-site-uk'

## License

[MIT](https://github.com/atom/atom/blob/master/LICENSE.md)