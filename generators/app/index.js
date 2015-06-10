'use strict';
var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var yosay = require('yosay');
// var users = require('./users');

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
  },

  askFor: function () {

    var done = this.async();

    this.log(yosay('Welcome to join ' + chalk.red('Animore') + '! It is Amazing. Let\'s Go! :-)'));

    // API请参考：https://github.com/SBoudrias/Inquirer.js
    var prompts = [{
      type    : 'input',
      name    : 'developer',
      message : '前端是谁?',
      'validate': function(input) {
        var done = this.async();
        if (input.length < 2 || input.length > 3 || input.match(/[^\u4e00-\u9fa5]/g)) {
          done("亲，请输入正确的花名哟~~~");
          return;
        }
        done(true);
      }
    }, {
      type    : 'input',
      name    : 'designer',
      message : '设计是谁?',
      'validate': function(input) {
        var done = this.async();
        if (input.length < 2 || input.length > 3 || input.match(/[^\u4e00-\u9fa5]/g)) {
          done("亲，请输入正确的花名哟~~~");
          return;
        }
        done(true);
      }
    }, {
      type    : 'input',
      name    : 'id',
      message : '设计稿编号是多少(请输入数字)?',
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
      message: '是否想用CSS解析器?',
      choices: [{
        name: 'Less',
        value: 'includeLess',
        checked: true
      },{
        name: '不用LESS',
        value: 'includeNo',
        checked: false
      }]
    }, {
      type    : 'input',
      name    : 'width',
      message : '动效的宽度是多少?(可在代码中修改)',
      'default' : '400',
      'validate': function(input) {
        var done = this.async();
        if (!/^\d+$/.test(input.trim())) {
          done("亲，必须是数字哟，请重新输入~~~");
          return;
        }
        done(true);
      }
    }, {
      type    : 'input',
      name    : 'height',
      message : '动效的高度是多少?(可在代码中修改)',
      'default' : '400',
      'validate': function(input) {
        var done = this.async();
        if (!/^\d+$/.test(input.trim())) {
          done("亲，必须是数字哟，请重新输入~~~");
          return;
        }
        done(true);
      }
    }

    ];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      // this.includeSass = hasFeature('includeSass');
      this.includeLess = hasFeature('includeLess');

      this.designer = answers.designer;
      //this.designerName = users.getUserName(this.designer);
      this.developer = answers.developer;
      //this.developerName = users.getUserName(this.developer);
      this.id = answers.id;
      this.browsers = answers.browsers;
      this.width = answers.width;
      this.height = answers.height;

      // this.rootDir = this.developer + '-' + this.designer + '-' + this.id;
      this.rootDir = 'animore-' + answers.id;

      done();
    }.bind(this));
  },

  gruntfile: function () {
    this.copy('Gruntfile.js', this.rootDir + '/Gruntfile.js');
  },

  packageJSON: function () {
    render(this, 'package.json', this, this.rootDir + '/package.json')
  },

  git: function () {
    this.template('gitignore', this.rootDir + '/.gitignore');
  },

  jshint: function () {
    this.copy('jshintrc', this.rootDir + '/.jshintrc');
  },

  readme: function () {
    this.copy('README.md', this.rootDir + '/README.md');
  },


  app: function () {
    this.directory(this.rootDir);

    render(this, 'index.html', this, this.rootDir + '/index.html')

    mkdirp(this.rootDir + '/js');
    this.copy('main.js', this.rootDir + '/js/main.js');


    mkdirp(this.rootDir + '/css');
    this.template('main.css', this.rootDir + '/css/main.css');

    // if (this.includeSass) {
    //   this.template('main.sass', this.rootDir + '/css/main.sass');
    // }
    if (this.includeLess) {
      this.template('main.less', this.rootDir + '/css/main.less');
    }

    //mkdirp(this.rootDir + '/imgs');

    mkdirp(this.rootDir + '/build');
    this.copy('index.html', this.rootDir + '/build/index.html');

    mkdirp(this.rootDir + '/doc');

  },

  install: function () {
    this.log('\n--------------------------------\n\n' + 
      '恭喜！已成功创建动效 ' + chalk.green(this.rootDir) + '，接下来，请：\n\n' + 
      '1. 进入目录 ' + chalk.green(this.rootDir) + '\n' + 
      '2. 执行命令 ' + chalk.green('npm install') + ' (如果要sudo，请sudo)\n' + 
      '3. 开始开发 ' + chalk.green('grunt dev') + '\n' + 
      '4. 打包交付 ' + chalk.green('grunt build') + '，build目录下有惊喜~ \n'
    );
  }
});
