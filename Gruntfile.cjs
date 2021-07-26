module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      sass: {
        dist: {
          files: {
            './public/css/main.css': './sass/main.scss'
          }
        }
      },
      watch: {
        scripts: {
          files: ['./sass/modules/*.scss', "./sass/main.scss"],
          tasks: ['sass'],
          options: {
            spawn: false,
          },
        },
      },
    });
  
    
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
  
    // Default task(s).
    grunt.registerTask('default', ['sass']);
  
  };