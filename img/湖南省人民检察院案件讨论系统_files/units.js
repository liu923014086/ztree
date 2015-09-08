define(["backbone", "models/unit"],
    function (Backbone, Unit) {
        App.Collections.Units = Backbone.Collection.extend({
            model: Unit,
			url: 'rest/unit/listAllUnits',
            sync: function (method, model, options) {
                return Backbone.sync(method, model, options);
            },
            parse: function (data, xhr) {
                return data.data;
            }
        });
     return App.Collections.Units;
});