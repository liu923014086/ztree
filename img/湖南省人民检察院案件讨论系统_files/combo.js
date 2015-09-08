///<reference path="../libs/jQuery/jquery1.9.js" />
///<reference path="../libs/flat-ui/jquery.dropkick-1.0.0.js" />
///<reference path="../libs/underscore.js" />
define(['jquery', 'underscore', 'dropkick'],
    function ($, _, dropkick) {
        var Combo = App.Widgets.Combo = function (el, options) {
            // console.log(this);
            this.$el = el;
			this.loading = false;
			this.options = $.extend({},options);
            this.options.url = options.url || el.attr('data-url');
            this.options.tpl = options.tpl || (el.attr('data-tpl') ? $(el.attr('data-tpl')).html() : el.find('script').html());
			if((this.options.url||this.options.data)&& !this.options.tpl){
				this.options.valueproperty = options.valueproperty || el.attr('data-valueproperty');
				this.options.displayproperty = options.displayproperty || el.attr('data-displayproperty');
				this.options.tpl = ['<% _.each( datas, function( data ) { %><option value="<%=',
							this.options.valueproperty ? 'data.'+this.options.valueproperty : 'data',
							'%>"><%=',
							this.options.displayproperty ? 'data.'+this.options.displayproperty : 'data',
							'||"&nbsp;"%></option><% });%>'].join('');
			}
            this.options.dataProperty = this.options.dataProperty || 'data';
            if (this.options.tpl) {
                if (this.options.data) {
                    this.build();
                }else if (this.options.url) {
                    this.syncBuild();
                }  
            }
            else {
                el.dropkick(this.options);
            }
        };
        Combo.prototype = {
            constructor: Combo,
			setReadOnly: function (readonly) {
				this.$el.dropkick('readonly',readonly);
			},
            syncBuild: function (options) {
				this.options = $.extend(this.options, options);
                var me = this;
				this.loading = true;
                $.getJSON(
                this.options.url,
				this.options.params,
                function (json) {
					this.loading = false;
                    if (json.success) {
                        me.options.data = json[me.options.dataProperty];
                        me.build();
                        /*var val = me.$el.val() || me.$el.attr('data-value') || me.options.defaultValue;
                        me.$el.trigger('getDropmenuData', val||me.$el.val());*/
                    }
                });
            },
            build: function (options) {
				var me = this;
				this.options = $.extend(this.options, options);
                var obj = this.$el.data('dropkick');
                if (obj) {
                    if (this.options.rebuild) {
                        if (obj.$dk) {
                            obj.$dk.remove();
                        }
                        this.$el.data('dropkick', {});
                    } else {
                        return;
                    }
                }
                var html = _.template(this.options.tpl, { datas: this.options.data});
                var val = this.$el.val() || this.$el.attr('data-value') || this.options.defaultValue;
                this.$el.html(html).val(val).dropkick(this.options);
				if(this.options.change){
					this.options.change.call(this.$el,this.$el,val||this.$el.val());
				}

            }
        };
        $.fn.combo = function (options) {
            options = options || {};
            this.each(function () {
                var combo = $(this).data('combo');
                if (combo) {
                    if (options.url || options.params) {
                    	options.rebuild = true;
                        combo.syncBuild(options);
                    } else if (options.data) {
                    	options.rebuild = true;
                        combo.build(options);
                    } else if (options.readonly || options.readonly === false) {
                        combo.setReadOnly(options.readonly);
                    }
                } else {
                    $(this).data('combo', new Combo($(this), options));
                }
            });
            return this;
        }
        return App.Widgets.Combo;
    })