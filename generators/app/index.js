'use strict';
var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });

    this.coffee = this.options.coffee;
  },

  askFor: function () {

    var done = this.async();

    this.log(yosay('Welcome to join ' + chalk.red('Animore') + '! It is Amazing. Let\'s Go! :-)'));

    // https://github.com/SBoudrias/Inquirer.js
    var prompts = [{
      type    : 'input',
      name    : 'developer',
      message : '前端是谁?(请输入首字母，例如：思竹-->sz，麦梓-->mz)',
      'default' : '',
      'validate': function(input) {
        var done = this.async();
        setTimeout(function() {
          if (input.length != 2 || !/^[a-z]{2}$/.test(input)) {
            done("亲，必须输入花名的前两个字母哟，请重新输入~~~");
            return;
          }
          done(true);
        }, 100);
      }
    }, {
      type    : 'input',
      name    : 'designer',
      message : '设计是谁?(请输入首字母，例如：辉达-->hd，俄木-->em)',
      'default' : '',
      'validate': function(input) {
        var done = this.async();
        setTimeout(function() {
          if (input.length != 2 || !/^[a-z]{2}$/.test(input)) {
            done("亲，必须输入花名的前两个字母哟，请重新输入~~~");
            return;
          }
          done(true);
        }, 100);
      }
    }, {
      type    : 'input',
      name    : 'order',
      message : '设计稿编号是多少(请输入数字)?',
      'default' : '',
      'validate': function(input) {
        var done = this.async();
        setTimeout(function() {
          if (!/^\d+$/.test(input.trim())) {
            done("亲，必须是数字哟，请重新输入~~~");
            return;
          }
          done(true);
        }, 100);
      }
    }, {
      type: 'list',
      name: 'features',
      message: '想用哪个CSS解析器?',
      choices: [{
        name: 'Less',
        value: 'includeLess',
        checked: true
      },{
        name: 'Sass',
        value: 'includeSass',
        checked: false
      },{
        name: '啥也不用',
        value: 'includeNo',
        checked: false
      }]
    }

    // , {
    //   type: 'confirm',
    //   name: 'someOption',
    //   message: 'Would you like to enable this option?',
    //   'default': true
    // }

    ];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeSass = hasFeature('includeSass');
      this.includeLess = hasFeature('includeLess');

      this.designer = answers.designer.toLowerCase();
      this.developer = answers.developer.toLowerCase();
      this.order = answers.order;

      this.rootDir = this.designer + '-' + this.developer + '-' + this.order;
      this.id = 'animore-' + this.rootDir;
      done();
    }.bind(this));
  },

  gruntfile: function () {
    this.template('Gruntfile.js', this.rootDir + '/Gruntfile.js');
  },

  packageJSON: function () {
    this.template('_package.json', this.rootDir + '/package.json');
    // 替换ID
    var content = this.read('_package.json');
    content = content.replace(/ID/g, this.id);
    this.write(this.rootDir + '/package.json', content);
  },

  git: function () {
    this.template('gitignore', this.rootDir + '/.gitignore');
    // this.copy('gitattributes', this.rootDir + '/.gitattributes');
  },

  // bower: function () {
  //   // var bower = {
  //   //   name: this._.slugify(this.appname),
  //   //   private: true,
  //   //   dependencies: {}
  //   // };

  //   this.copy('bowerrc', this.rootDir + '/.bowerrc');
  //   this.write('bower.json', JSON.stringify({
  //     name: this.appname,
  //     private: true,
  //     dependencies: {}
  //   }, null, 2));
  // },

  jshint: function () {
    this.copy('jshintrc', this.rootDir + '/.jshintrc');
  },

  readme: function () {
    this.copy('README.md', this.rootDir + '/README.md');
  },

  // editorConfig: function () {
    // this.copy('editorconfig', this.rootDir + '/.editorconfig');
  // },

  app: function () {
    this.directory(this.rootDir);
    this.template('index.html', this.rootDir + '/index.html');
    var content = this.read('index.html');
    content = content.replace(/ID/g, this.id);
    this.write(this.rootDir + '/index.html', content);

    mkdirp(this.rootDir + '/js');
    this.copy('main.js', this.rootDir + '/js/main.js');


    mkdirp(this.rootDir + '/css');
    this.template('main.css', this.rootDir + '/css/main.css');

    if (this.includeSass) {
      this.template('main.sass', this.rootDir + '/css/main.sass');
    }
    if (this.includeLess) {
      this.template('main.less', this.rootDir + '/css/main.less');
    }

    mkdirp(this.rootDir + '/imgs');

    mkdirp(this.rootDir + '/build');
    this.copy('index.html', this.rootDir + '/build/index.html');

    mkdirp(this.rootDir + '/doc');

    // this.fs.copy(
    //   this.templatePath('editorconfig'),
    //   this.destinationPath(this.rootDir, 'editorconfig')
    // );
  },

  install: function () {
    this.log('\n--------------------------------\n\n' + 
      '恭喜！已成功创建动效 ' + chalk.green(this.rootDir) + '，接下来，请：\n\n' + 
      '1. 进入目录 ' + chalk.green(this.rootDir) + '\n' + 
      '2. 执行命令 ' + chalk.green('npm install') + ' (如果要sudo，请sudo)\n' + 
      '3. 开始开发 ' + chalk.green('grunt dev') + '\n');
  }
});
