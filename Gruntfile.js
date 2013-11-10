/*jshint node:true */
module.exports = function(grunt) {
  "use strict";

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-literate');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    mochaTest: {
      files: ['test/pat_test.js', 'test/readme.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    literate: {
      "readme": {
        src: "test/readme.js",
        dest: "README.md",
        options: {
          code: true,
        },
      },
    },
    jshint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        globals: {
          it: true,
          describe: true
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['mochaTest', 'literate']);

};