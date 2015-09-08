define(['jquery','text!templates/dialog.html'], function ($,tpl) {
    var ModalDlg = App.Widgets.ModalDlg = function (options) {
        var me = this;
		var id = options.id || 'modaldlg';
		var cls = options.cls || '';
        this.$el = $('#'+id);
		if(this.$el.length < 1){
			this.$el = $('<div class="modal '+cls+'" id="'+id+'"><div class="modal-dialog"><div class="modal-content"></div></div></div>').appendTo(document.body);
		}
		this.tpl = tpl;
		this.title = options.title || '';
		this.content = options.content;
		var data = {title:this.title};
		this.$el.find('.modal-content').html(_.template(this.tpl,data));
		if(this.content){
			this.content = $(this.content).appendTo(this.$el.find('.modal-body'));
		}
		this.closeAction = options.closeAction;
        this.$el.on('click','button.close',function (e) {
			var ret = true;
			if(me.closeAction){
				ret = me.closeAction.call(me,this);
			}
			if(ret){
				me.close();
			}
        });
        return this;
    }

    ModalDlg.prototype = {
        constructor: ModalDlg,
        domodal: function () {
            this.$el.modal({backdrop:false,keyboard:false});
			return this;
        },
		close:function(){
			this.$el.modal('hide');
			return this;
		},
		show:function(){
			this.$el.modal('show');
			return this;
		},
		setTitle:function(title){
			var _title = this.$el.find('.modal-title span');
			title && _title.html(title);
			return _title.html();
		},
        setContent: function(data) {
            var me = this;
            me.$el.find('.modal-body').html(data);
        }
    };
	
	$.fn.domodal = function (options) {
		var $el = $(this);
		options = options || {};
		if($el.length){
			var dlg = $el.data('modaldlg');
			if(!dlg){
			  options.content = $el;
			  dlg = new ModalDlg(options);
			  $el.data('modaldlg',dlg);
			}
			return dlg.domodal(options);
		}
	}
    return ModalDlg;
});
















