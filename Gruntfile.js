'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the module
    var props = {
        src: 'src',
        dist: 'dist',
        test: 'test',
        spec: 'test/spec',
        example: 'example',
        tmp: '.tmp'
    };

    // Project propsuration.
    grunt
        .initConfig({
            pkg: grunt.file.readJSON('bower.json'),
            props: props,
            meta: {
                banner: [
                    '/**',
                    ' * @description <%= pkg.description %>',
                    ' * @version v<%= pkg.version %> - <%= grunt.template.today() %>',
                    ' * @link <%= pkg.homepage %>',
                    ' * @authors <%= pkg.authors.join(", ") %>',
                    ' * @license MIT License, http://www.opensource.org/licenses/MIT',
                    ' */',
                    ''
                ].join('\n')
            },
            // Automatically inject Bower components into the app
            wiredep: {
                test: {
                    devDependencies: true,
                    src: '<%= karma.unit.configFile %>',
                    ignorePath: /\.\.\//,
                    fileTypes: {
                        js: {
                            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                            detect: {
                                js: /'(.*\.js)'/gi
                            },
                            replace: {
                                js: '\'{{filePath}}\','
                            }
                        }
                    }
                }
            },
            //clean environments
            clean: {
                dist: {
                    files: [{
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= props.dist %>'
                        ]
                    }]
                },
                server: '.tmp'
            },
            // Make sure code styles are up to par
            // and there are no obvious mistakes
            jshint: {
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish')
                },
                src: {
                    src: [
                        'Gruntfile.js',
                        '<%= props.src %>/**/*.js'
                    ]
                },
                test: {
                    options: {
                        jshintrc: '<%= props.test %>/.jshintrc'
                    },
                    src: ['<%= props.spec %>/**/*.js']
                },
                example: {
                    src: ['<%= props.example %>/**/*.js']
                }
            },

            //watch environment
            watch: {
                bower: {
                    files: ['bower.json'],
                    tasks: ['newer:jshint:src', 'newer:jshint:test', 'karma']
                },
                src: {
                    files: ['<%= props.src %>/**/*.js'],
                    tasks: ['newer:jshint:src', 'karma'],
                },
                test: {
                    files: ['<%= props.test %>/karma.conf.js', '<%= props.spec %>/**/*.js'],
                    tasks: ['newer:jshint:test', 'karma']
                },
                gruntfile: {
                    files: ['Gruntfile.js'],
                    tasks: ['newer:jshint:src', 'newer:jshint:test', 'karma']
                },
                example: {
                    files: [
                        '<%= props.example %>/{,*/}*.js',
                        '<%= props.example/{,*/}*.html',
                        '<%= props.example/views/{,*/}*.html',
                        '<%= props.example %>/styles/{,*/}*.css'
                    ],
                    tasks: ['newer:jshint:example'],
                    options: {
                        livereload: '<%= connect.options.livereload %>'
                    }
                },
                livereload: {
                    options: {
                        livereload: '<%= connect.options.livereload %>'
                    },
                    files: [
                        '<%= props.example %>/{,*/}*.html',
                        '<%= props.example %>/views/{,*/}*.html',
                        '<%= props.example %>/styles/{,*/}*.css'
                    ]
                }
            },

            //concat task configuration
            concat: {
                options: {
                    banner: '<%= meta.banner %>\n',
                    stripBanners: true,
                    separator: '\n\n'
                },
                dist: {
                    files: {
                        'dist/<%= pkg.name %>.js': [
                            '<%= props.tmp %>/ngData.js',
                            '<%= props.tmp %>/constants/**/*.js',
                            '<%= props.tmp %>/providers/**/*.js',
                            '<%= props.tmp %>/services/**/*.js',
                            '<%= props.tmp %>/directives/**/*.js'
                        ]
                    }
                },
                ex: {
                    files: {
                        'examples/<%= pkg.name %>.js': [
                            '<%= props.tmp %>/ngData.js',
                            '<%= props.tmp %>/constants/**/*.js',
                            '<%= props.tmp %>/providers/**/*.js',
                            '<%= props.tmp %>/services/**/*.js',
                            '<%= props.tmp %>/directives/**/*.js'
                        ]
                    }
                }
            },
            // ng-annotate tries to make the code safe for minification automatically
            // by using the Angular long form for dependency injection.
            ngAnnotate: {
                dist: {
                    options: {
                        singleQuotes: true,
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= props.src %>',
                        src: ['**/*.js'],
                        dest: '<%= props.tmp %>'
                    }]
                }
            },

            //karma task configuration
            karma: {
                unit: {
                    configFile: '<%= props.test %>/karma.conf.js',
                    singleRun: true
                }
            },

            // The actual grunt server settings
            connect: {
                options: {
                    port: 9000,
                    // Change this to '0.0.0.0' to access the server from outside.
                    hostname: 'localhost',
                    livereload: 35729
                },
                livereload: {
                    options: {
                        open: true,
                        middleware: function(connect) {
                            return [
                                connect.static('example'),
                                connect().use(
                                    '/bower_components',
                                    connect.static('./bower_components')
                                ),
                                connect().use(
                                    '/dist',
                                    connect.static('./dist')
                                )
                            ];
                        }
                    }
                }
            }
        });

    grunt.registerTask('serve', 'Compile then start a connect web server', function() {
        grunt.task.run([
            'clean:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'karma',
        'ngAnnotate',
        'concat:dist'
    ]);

    grunt.registerTask('buildex', [
        'jshint',
        'karma',
        'ngAnnotate',
        'concat:ex'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'karma'
    ]);

};
