module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: [{
                    expand: true,
                    cwd: 'styles/src/',
                    src: ['*.scss'],
                    dest: 'styles/',
                    ext: '.css'
                }]
            }
        },

        rename: {
            main: {
                files: [{
                    src: ['styles/base.css'],
                    dest: 'styles/_base.css'
                }]
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: [{
                    src: 'js/*.js',
                    dest: 'chat.min.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('Compile-All', ['sass', 'rename', 'uglify']);
    grunt.registerTask('Compile-CSS', ['sass', 'rename']);
    grunt.registerTask('Compile-JS', ['uglify']);
};
