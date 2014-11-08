module.exports = function(grunt) {


  grunt.initConfig({
    '6to5': {
        options: {
            modules: 'amd'
        },
        build: {
            files: [{
                expand: true,
                cwd: './',
                src: ['js/battery.js', 'js/robot.js', 'js/main.js'],
                dest: 'build/',
            }],
        }
      }
  });

  grunt.loadNpmTasks('grunt-6to5');

  grunt.registerTask('6-to-5', ['6to5']);
}