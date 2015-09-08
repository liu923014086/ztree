///<reference path="../libs/jQuery/jquery1.9.js" />
///<reference path="../libs/bootstrap/bootstrap.js" />
///<reference path="../libs/flat-ui/jquery.dropkick-1.0.0.js" />
///<reference path="../libs/flat-ui/jquery.placeholder.js" />
///<reference path="../libs/underscore.js" />
///<reference path="../libs/backbone.js" />
///<reference path="../libs/require.js" />

require.config({
    baseUrl: RESOUCE_STATIC_URL+'/js',
    paths: {
		templates:RESOUCE_STATIC_URL+'/templates',
        jquery: 'libs/jQuery/jquery-1.9.0',
        backbone: 'libs/backbone',
        underscore: 'libs/underscore',
        bootstrap: 'libs/bootstrap/bootstrapv3',
        flatui: 'libs/flat-ui',
        dropkick: 'libs/dropkick',
        placeholder: 'libs/jquery.placeholder',
        text: 'libs/text',
        domReady: 'libs/domReady',
        stacktrace: 'libs/stacktrace',
		cookieutil:'libs/cookieUtil',
		checkbox:'libs/checkbox',
		timepicker:'libs/bootstrap/bootstrap-timepicker',
		datepicker:'libs/bootstrap/bootstrap-datepicker',
		paginator:'libs/bootstrap/bootstrap-paginator',
		highcharts:'libs/highcharts',
		ztree:'libs/jquery.ztree.core-3.5',
        ztreeexcheck:'libs/jquery.ztree.excheck-3.5',
		slimscroll:'libs/jquery.slimscroll',
        bootgrid:'libs/bootgrid/jquery.bootgrid',
        ajaxfileupload:'libs/ajaxfileupload'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },
        'dropkick': {
            deps: ['jquery'],
            exports: 'Dropkick'
        },
        'placeholder': {
            deps: ['jquery'],
			exports:'Placeholder'
        },
		'checkbox':{
			deps: ['jquery'],
			exports:'Checkbox'
		},
		'timepicker':{
			deps: ['jquery'],
			exports:'Timepicker'
		},
		'datepicker':{
			deps: ['jquery'],
			exports:'Datepicker'
		},
		'paginator':{
			deps: ['bootstrap'],
			exports:'Paginator'
		},
		'highcharts':{
			deps: ['jquery'],
			exports:'Highcharts'
		},
		'slimscroll':{
			deps:['jquery'],
			exports:'slimscroll'
		},
		'ztree':{
			deps: ['jquery'],
			exports:'zTree'
		},
        ztreeexcheck : {
            deps: ['jquery','ztree'],
            exports:'ztreeexcheck'
        },
        'bootgrid':{
            deps: ['jquery'],
            exports:'bootgrid'
        },
        'ajaxfileupload':{
            deso : ['jquery'],
            exports:'ajaxfileupload'
        }
    },
	urlArgs: "_dc=" +  (new Date()).getTime()
});

App = {
    Views: {},
    Routers: {},
    Collections: {},
    Widgets: {},
	Models:{},
    Defines: {},
    Stores:{}
	
};
require([
    'libs/domReady',
	'widgets/cometter',
    'jquery',
	'bootstrap',
    'routers/navigate',
	'utils',
	'views/systemmenu',
	'slimscroll',
    'configs'
],
    function (domReady, Cometter, $,Bootstrap,Navigate,Utils,SystemMenu) {
        domReady(function () {
			App.navigator = new Navigate();
            Backbone.history.start({
                //silent:true
            });
			App.cometter = new Cometter(
				'comet/getSystemEvent',
				6000,
				100,
				function(){window.location.replace("login")}
			);
			App.cometter.addListenner('MSG_SERVER_PROMPT',function(json){Utils.alert(json)});
			App.cometter.start();	/*轮询、监听*/
			App.systemMenu = new SystemMenu({el:$('.header .header-menu')});
			$('.main').slimScroll({height: '100%'});
			if(Utils.isIE){
				$.ajaxSetup({ cache: false });
			}
			$.ajaxSetup({	/*设置ajax默认参数*/
				complete: function (xhr, status) {
					if(xhr.status === 499){
						window.location.replace("login");
					}
				}
			});
			$(document).keydown(function(event) {//禁用backspace键的后退功能
				var e=window.event;
				if (event.keyCode == 8 ) { 
					if(e.srcElement.readOnly || (e.srcElement.type != "text" && 
					         e.srcElement.type != "textarea" && 
					         e.srcElement.type != "password" &&
					         e.srcElement.type != "search"))
					event.preventDefault();  
				} 
			});
        });
    });