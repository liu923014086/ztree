///<reference path="../libs/require.js" />
///<reference path="../libs/jQuery/jquery1.9.js" />
///<reference path="../libs/underscore.js" />
///<reference path="../libs/backbone.js" />

define([
    'jquery',
    'backbone'
],
    function ($, Backbone) {
        App.Views.FormBase = Backbone.View.extend({
            initialize: function (options) {
                _.bindAll(this, 'render','validate');
				_.extend(this,options);
                this.mode('create');
				if(!this.manualRender){
                	this.render();
				}
            },
			/*callParent:function(){
				var method = arguments.callee.caller;
				var _super =  arguments.__scope__ || this.getsuper();
				var callparent = _super && _super[method.$name]
				if(callparent){
					arguments.__scope__ = _super.constructor && _super.constructor.__super__;
					callparent.apply(this, arguments);
				}
			},*/
			getsuper:function(){
				return this.constructor.__super__;
			},
            mode: function (mod) {
                if (mod != this.mod) {
                    this.mod = mod;
                    (this.mod == 'read') ?
                        this.$el.addClass('mode-read') : this.$el.removeClass('mode-read');
                    this.trigger('modeChanged', mod, this.model);
                }
            },
            render: function () {
				if(!this.rendered){
					if (this.model) {
						this.reload(this.model);
					}
					if(this.autoValid){
						var me = this;
						this.$el.find('input,select,textarea').on('blur',this.validate);
					}
					this.rendered = true;
				}
            },
			validate:function(e){
				var input = $(e.target);
				if(this.model && this.model.validate){
					var name = input.attr("name");
					if(name){
						var attr = {};
						this.fuse(name,input.val(),attr);
						var error = this.model.validate(attr);
						var me = this;
						this.onValidInput(input,error);			
					}
				}
			},
            onunload: function () {
            },
            onload: function (attributes) {
            },
            onreset: function () {
            },
            onretrieve: function (attributes) {
            },
			onValidInput:function(input,error){
			},
            reload: function (m) {
                m = m || this.model;
				var me = this;
                if (m != this.model) {
                    this.unload();
                    this.model = m;
                    this.model.on('change', this.reload, this);
                    this.model.on('destroy', this.unload, this);
					this.model.on('sync',this.reload, this);
                    this.model.on('invalid', function (model, error) {
                        Utils.alert(error);
                    })
                }
                this.$el.find('input,select,textarea').each(function () {
                    var input = $(this);
                    var value = me.pick(m.attributes,input.attr("name"));
					if(typeof(value) === 'undefined') return true;
					var isdropmenu = input.hasClass('dropmenu');
					if(input.attr('type')=='radio'){
						if(input.val() == value){
							input.attr("checked",true);
						}else{
							input.attr("checked",false);
						}
					}else if(input.attr('type')=='checkbox'){
						if(value && (value==true || value===input.attr("data-checkedvalue"))){
							input.prop("checked",true);
						}else{
							input.prop("checked",false);
						}
					}
                    else if (input.val() != value) {
						if(isdropmenu){
							input.attr("data-value",value);
						}
                        input.val(value);
                    }
					if (isdropmenu || input.hasClass('checkbox') || input.hasClass('listbox')) {
						//improve performance
						_.defer(function () { input.trigger('change') });
					}
                });
				this.onload(m.attributes);
            },
            unload: function () {
                if (this.model) {
                    this.model.off('change', this.reload);
                    this.model.off('destroy', this.unload);
					this.model.off('sync',this.reload);
                    this.model.off('invalid');
                    this.onunload();
                    this.model = null;
                }
                this.$el.find('input,select,textarea').each(function () {
                    var input = $(this);
					var isdropmenu = input.hasClass('dropmenu');
					var type = input.attr('type');
					if(type == 'checkbox'){
						input.attr("checked",false);
					}else if(type != 'radio'){
                    	if(isdropmenu && Utils.isIE()){
							input.val(null);
							input.find('option:first').attr('selected','selected');
						}else{
							input.val(null);
						}
					}
                    if (isdropmenu || input.hasClass('checkbox')|| input.hasClass('listbox')) {
                        //improve effective
                        _.defer(function () { input.trigger('change') });
                    }
                });
                this.onreset();
            },
            retrieve: function () {
                var attr = {};
                var me = this;
                this.$el.find('input,select,textarea').each(function () {
                    var input = $(this);
                    var name = !input.is(':disabled') && input.attr('name');
                    if (name) {
						var v ;
						if(input.attr('type')=='radio'){
							if(input.is(':checked')){
								v = input.attr('value');
							}
							else{
								return true;
							}
						}else if(input.attr('type')=='checkbox'){
							if(input.is(':checked')){
								v = input.attr('data-checkedvalue');
								if(typeof (v) === 'undefined'){
									v = true;
								}
							}else{
								v = input.attr('data-uncheckedvalue');
								if(typeof (v) === 'undefined'){
									v = false;
								}
							}
						}else{
							v = input.val();
						}
                        me.fuse(name,v,attr);
                    }
                });
                this.onretrieve(attr);
                return attr;
            },
            submit: function (handler,params,options,removeAttrName) {
                var attrs = this.retrieve();
                if(removeAttrName){
                    var removeArr = removeAttrName.split(',');
                    _.each(removeArr,function(n,i){
                        attrs = _.omit(attrs,n);
                    });
                }
				if(params) _.extend(attrs,params);
                var me = this, m = this.model;
                var update = !!m.id;
                if (attrs) {
					options = _.extend({
                        wait: update,
                        success: function (model, result) {
                            if (result.success) {
                                if (!update && m.collection) {
                                    m.collection.add(m);
                                }
                            }
							if (handler) {
								handler.call(this, result);
							}
                        }
                    },options);
                    m.save(attrs,options);
                }

            },
			fuse:function(name,value,attr){
				if(name){
					var names = name.split('.');
					var length = names.length;
					var _name;
					var _attr = attr;
					var i = 0;
					while(length > i){
						_name = names[i];
						++i;
						if(i !== length){
							_attr = _attr[_name] = _attr[_name]|| {};
						}
					}
					_attr[_name] = value;
				}
			},
			pick:function(attr,name){
				if(name && attr){
					var names = name.split('.');
					var length = names.length;
					var _name;
					var _attr = attr;
					var i = 0;
					while(length > i){
						_name = names[i];
						++i;
						if(i !== length && _attr){
							_attr = _attr[_name];
						}
					}
					return _attr && _attr[_name];
				}
			},
			pickComboData:function($select,propname){
				var combo = $select && $select.data('combo');
				var selVal = $select.val();
				var valueProperty = $select.attr('data-valueproperty');
				var store = combo.options.data;
				if(combo && store && valueProperty){
					var len = store.length;
					for(var i = 0 ; i<len ; ++i){
						var data = store[i];
						if(data[valueProperty] == selVal){
							return data[propname];
						}
					}
				}
			}
        });
        return App.Views.FormBase;
    });