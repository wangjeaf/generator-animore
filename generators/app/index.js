'use strict';
var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var yosay = require('yosay');
var users = require('./users');

function render(obj, file, data, target) {
    var tmpl = obj.read(file);

    var content = obj.engine(
      tmpl,
      data
    );

    obj.write(target, content);
}

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
        if (input.length != 2 || !/^[a-z]{2}$/.test(input)) {
          done("亲，必须输入花名的前两个字母哟，请重新输入~~~");
          return;
        }
        done(true);
      }
    }, {
      type    : 'input',
      name    : 'designer',
      message : '设计是谁?(请输入首字母，例如：辉达-->hd，俄木-->em)',
      'default' : '',
      'validate': function(input) {
        var done = this.async();
        if (input.length != 2 || !/^[a-z]{2}$/.test(input)) {
          done("亲，必须输入花名的前两个字母哟，请重新输入~~~");
          return;
        }
        done(true);
      }
    }, {
      type    : 'input',
      name    : 'order',
      message : '设计稿编号是多少(请输入数字)?',
      'default' : '',
      'validate': function(input) {
        var done = this.async();
        if (!/^\d+$/.test(input.trim())) {
          done("亲，必须是数字哟，请重新输入~~~");
          return;
        }
        done(true);
      }
    }, {
      type: 'checkbox',
      name: 'browsers',
      message: '支持哪些浏览器?',
      choices: [{
        name: 'IE9+',
        value: 'ie9+',
        checked: false
      },{
        name: 'IE9-',
        value: 'ie9-',
        checked: false
      },{
        name: 'Firefox',
        value: 'Firefox',
        checked: true
      },{
        name: 'Chrome',
        value: 'Chrome',
        checked: true
      },{
        name: 'Safari',
        value: 'Safari',
        checked: true
      }]
    }, {
      type: 'list',
      name: 'features',
      message: '想用哪个CSS解析器?',
      choices: [{
        name: 'Less',
        value: 'includeLess',
        checked: true
      },{
        name: '不用LESS',
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
      this.designerName = users.getUserName(this.designer);
      this.developer = answers.developer.toLowerCase();
      this.developerName = users.getUserName(this.developer);
      this.order = answers.order;
      this.browsers = answers.browsers;

      this.rootDir = this.developer + '-' + this.designer + '-' + this.order;
      this.id = 'animore-' + this.rootDir;
      
      done();
    }.bind(this));
  },

  gruntfile: function () {
    this.template('Gruntfile.js', this.rootDir + '/Gruntfile.js');
  },

  packageJSON: function () {
    render(this, '_package.json', this, this.rootDir + '/package.json')
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

    render(this, 'index.html', this, this.rootDir + '/index.html')

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
