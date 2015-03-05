module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)
  path = require('path')
  pkg = grunt.file.readJSON("package.json")

  DEBUG = false # 添加测试所需代码，发布时应该为false

  grunt.initConfig 
    pkg: pkg
    meta:
      banner: "/**\n" + " * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %>\n" + " * <%= pkg.homepage %>\n" + " *\n" + " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author %>\n" + " * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n" + " */\n"

    changelog:
      options:
        dest: "CHANGELOG.md"
        template: "changelog.tpl"

    bump:
      options:
        files: ["package.json", "bower.json"]
        commit: true
        commitMessage: "chore(release): v%VERSION%"
        commitFiles: ["-a"]
        createTag: true
        tagName: "v%VERSION%"
        tagMessage: "Version %VERSION%"
        push: true
        pushTo: "origin"

    clean: 
      all:
        dot: true
        files:
          src: [
            "bin/*"
            "!bin/vendor/**/*" # retain bower components
            ".temp"
          ]

    copy:
      other:
        files: [
          src: ["*.js", "README.md"]
          dest: "bin/"
          cwd: "src/"
          expand: true
        ]

    livescript:
      options:
        bare: false
      all:
        expand: true
        cwd: "src/"
        src: ["**/*.ls"]
        dest: "bin/"
        ext: ".js"


    requirejs:
      atPlusPage:
        options:
          baseUrl: 'bin'
          mainConfigFile: 'bin/index.js'
          # name: '../vendor/almond/almond'
          # include: 'index'
          name: 'index'
          insertRequire: ['index']
          out: 'bin/index.js'
          optimize: "none" # for developing
          # optimize: "uglify"
          done: (done, output) ->
            duplicates = require("rjs-build-analysis").duplicates(output)
            if duplicates.length > 0
              grunt.log.subhead "Duplicates found in requirejs build:"
              grunt.log.warn duplicates
              return done(new Error("r.js built duplicate modules, please check the excludes option."))
            done()          


    delta:
      options:
        livereload: false

      livescript:
        files: ["src/**/*.ls"]
        tasks: ["newer:livescript"]
        # tasks: ["newer:livescript", "requirejs"]

      other:
        files: ["src/*.js", "src/README.md"]
        tasks: ["newer:copy"]

 
  grunt.renameTask "watch", "delta"

  grunt.registerTask "watch", [
    "build"
    "delta"
  ]

  grunt.registerTask "default", [
    "build"
  ]

  grunt.registerTask "build", [
    "clean"
    "copy"
    "livescript"
    # "requirejs"
  ]
  