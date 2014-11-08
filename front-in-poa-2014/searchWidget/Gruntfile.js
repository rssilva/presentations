module.exports = function(grunt) {

  	grunt.initConfig({
	    plato: {
	    	task: {
	    		options: {
	    			jshint : false
	    		},
		        files: {
					'reports': ['searchWidgetv1.js', 'searchWidgetv2.js', 'userListPage.js']
		        }
	    	}
	    }
  	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-plato');

	grunt.registerTask('run-plato', ['plato']);
};