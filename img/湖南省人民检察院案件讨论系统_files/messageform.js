define([
	'views/configform'
	],
	function (ConfigForm) {
		App.Views.MessageForm = ConfigForm.extend({
			/*events:{
				'click .toolbar .cancel':'oncancelClick',
				'click .toolbar .submit':'onsubmitClick'
			},*/
            initialize: function (options) {
            	ConfigForm.prototype.initialize.apply(this, arguments);
				this.modalParent = options.parent;
            },
            render: function () {
            	ConfigForm.prototype.render.apply(this, arguments);
            },
		});
		return App.Views.MessageForm;
	});