module.exports = function(grunt) {

	//这里定义几个默认的任务
	grunt.initConfig({
		//监听的相关配置
		watch: {
			//设置用来监听的文件类型(文件法神改动时会触发相应的事件)
			jade: {
				//监听的jade文件的目录
				/*因为app.js中已经设置了路径,所以这里可以直接引用views*/
				// app.set('views', './app/views/pages');
				files: ['views/**'],
				options: {
					// 当文件发生改动的时候会重启服务
					livereload: true
				}
			},
			js: {
				// 监听的js文件的目录
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				// 执行语法检查
				// tasks:['jshint'],
				options: {
					livereload: true
				}
			}
		},
		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					// watchedFolders:['app','config'],
					debug: true,
					// 有大批量编译的时候,不用每个文件编译都要重启
					delayTime: 1,
					env: {
						PORT: 8899
					},
					cwd: __dirname
				}
			}
		},
		concurrent: {
			//被默认调用的任务中又传入了两个任务(nodemon和watch),用来执行上述两个任务
			tasks: ['watch', 'nodemon'],
			options: {
				logConcurrentOutput: true
			}
		}
	});
	//加载grunt-contrib-watch模块
	//作用:如果你有新的文件执行(添加/修改/删除),他就会执行你在他里边注册好的任务
	grunt.loadNpmTasks('grunt-contrib-watch');
	//用于实时监听入口文件(app.js)重启app.js
	grunt.loadNpmTasks('grunt-nodemon');
	//是针对慢任务开发的一个插件,(编译的任务,和阻塞任务)
	grunt.loadNpmTasks('grunt-concurrent');

	//开启调试模式,不让开发时的语法错误,中断整个服务
	grunt.option('force', true);

	//注册一个默认的任务(用来调用并执行concurrent任务)
	grunt.registerTask('default', ['concurrent']);
}