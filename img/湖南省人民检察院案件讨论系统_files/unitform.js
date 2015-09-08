///<reference path="../libs/jQuery/jquery1.9.js" />
///<reference path="../libs/bootstrap-all.js" />
///<reference path="../libs/flat-ui/jquery.dropkick-1.0.0.js" />
///<reference path="../libs/flat-ui/jquery.placeholder.js" />
///<reference path="../libs/underscore.js" />
///<reference path="../libs/backbone.js" />
///<reference path="../libs/require.js" />
///<reference path="../apps/configure.js" />
define([
    'views/configform',
	'placeholder',
	'widgets/combo'
	],
    function (ConfigForm) {
        App.Views.UnitForm = ConfigForm.extend({
            render: function () {
				this.$el.find('input').placeholder();
				this.$el.find('.dropmenu.parentUnit').combo({data:App.Stores.Units && App.Stores.Units.toJSON()});
				ConfigForm.prototype.render.apply(this, arguments);
            }
        });
        return App.Views.UnitForm;
    });
