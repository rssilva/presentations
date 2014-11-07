module.exports = function(grunt) {

  	grunt.initConfig({
	    watch: {
	      	karma: {
	        	files: [
	          		'searchWidget.js',
	          		'userListPage.js'
	        	],
	        	tasks: ['karma:watch']
	      	},
	    },
	    plato: {
	    	task: {
	    		options: {
	    			jshint : false
	    		},
		        files: {
		        	'reports': ['searchWidget.js', 'userListPage.js']
		        }
	    	}
	    }
  	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-plato');

	grunt.registerTask('run-plato', ['plato']);
};