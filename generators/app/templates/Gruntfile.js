module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ["app/header.html", "app/menu.html", "app/sections/*.html", "app/footer.html"],
        dest: "build/index.html"
      }
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
          tasks: [],
      },
      content: {
          files: ['**/*.js', '**/*.html'],
          tasks: []
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dev', ['connect', 'watch']);
  grunt.registerTask('build', ['concat']);
  grunt.registerTask('default', ['build']);
};