module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ["index.html"],
        dest: "build/index.html"
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /<link rel="stylesheet" type="text\/css" href="css\/main.css">/,
              replacement: '\n<style type="text\/css" class="animore-stylesheet">\n<%= grunt.file.read("css/main.css").trim() %>\n</style>\n'
            },
            {
              match: /<script type="text\/javascript" src="js\/main.js"><\/script>/,
              replacement: '\n<script type="text\/javascript" class="animore-javascript">\n<%= grunt.file.read("js/main.js").trim() %>\n</script>\n'
            },
            {
              match: /<script type="text\/javascript" src="http:\/\/g.tbcdn.cn\/mm\/animore\/.*\/animore.js"><\/script>/,
              replacement: ''
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['index.html'], dest: 'build/'}
        ]
      }
    },
    less: {
      build: {
        files: {
          "css/main.css": "css/main.less"
        }
      }
    },
    zip: {
      'build/<%= pkg.name %>.zip': [
        'index.html', 
        'css/main.css',
        'js/main.js',
        'imgs/preview.png',
        'build/index.html'
      ]
    },
    connect: {
      server: {
        options: {
          port: 8000,
          open: true
        },
      },
    },
    watch: {
      options: {
          livereload: true,
      },
      style: {
          files: ['**/*.css'],
          tasks: ['less'],
      },
      content: {
          files: ['**/*.js', '**/*.html'],
          tasks: []
      }
    },
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dev', ['connect', 'watch']);

  // grunt.registerTask('testImg', ['检测预览图是否存在'], function() {
  //   if(!grunt.file.exists('imgs/preview.png')) {
  //     grunt.log.warn('预览图preview.png不存在~');
  //     return false;
  //   }
  // });

  grunt.registerTask('build', ['less', 'replace', 'zip']);
  grunt.registerTask('default', ['build']);
};