///<reference path="../libs/jQuery/jquery1.9.js" />
///<reference path="../libs/bootstrap-all.js" />
///<reference path="../libs/flat-ui/jquery.dropkick-1.0.0.js" />
///<reference path="../libs/flat-ui/jquery.placeholder.js" />
///<reference path="../libs/underscore.js" />
///<reference path="../libs/backbone.js" />
///<reference path="../libs/require.js" />
///<reference path="../apps/configure.js" />
define([
    'views/formbase'
	],
    function (FormBase) {
        App.Views.ConfigForm = FormBase.extend({
			events:{
				'click .toolbar .cancel':'oncancelClick',
				'click .toolbar .submit':'onsubmitClick',
				'click .toolbar .search':'onsearchClick'
			},
            initialize: function (options) {
                this.on('modeChanged', this.modeChange, this);
				//render before this dom append to html body may cause problems
				this.manualRender = true;
                FormBase.prototype.initialize.apply(this, arguments);
            },
            modeChange: function (mod, model) {
				
            },
			onretrieve:function(attr){
				FormBase.prototype.onretrieve.apply(this,arguments);
			},
			onreset: function () {
				this.$el.find('input').parent().removeClass('invalid').removeClass('correct');
            },
            onload: function (model) {
            },
            oncancelClick: function (e) {
				this.unload();
                this.trigger('disappear','cancel',this);
            },
            onsubmitClick: function (e) {
				var me = this;
                this.submit(function(result){
					if(result.success){
						me.el.find('.submit').removeClass('disabled');
						me.trigger('disappear','submited',me);
					}else if(result.msg){
						Utils.alert(result.msg);
						me.$el.find('.submit').removeClass('disabled');
					}
				});
                
            },
			
			onsearchClick: function(e){
				var me = this;
				me.trigger('disappear','searched',me);              
			},
			
			onValidInput:function(input,error){
				if(error){
					input.parent().addClass('invalid').removeClass('correct');
				}else{
					input.parent().addClass('correct').removeClass('invalid');
				}
			}
        });
        return App.Views.ConfigForm;
    });
