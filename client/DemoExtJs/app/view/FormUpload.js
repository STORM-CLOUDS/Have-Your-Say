Ext.define('DemoExtJs.view.FormUpload', {
	extend : 'Ext.form.Panel',

	xtype : 'form-upload',

	requires : ['Ext.form.field.File', 'Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],

	title : 'Form File Upload',

	bodyPadding : 5,

	api : {
		submit : 'ExtRemote.DXFormTest.filesubmitshapefile'
	},

	paramOrder : ['uid'],

	items : [{
		xtype : 'imagecomponent',
		src : 'uploaded_images/Wiki.png' // 'http://www.sencha.com/img/20110215-feat-html5.png'
	}, {
		xtype : 'textfield',
		fieldLabel : 'Description',
		name : 'description'
	}, {
		xtype : 'filefield',
		name : 'photo',
		fieldLabel : 'Photo',
		labelWidth : 50,
		msgTarget : 'side',
		allowBlank : true,
		anchor : '40%',
		buttonText : 'Select Photo...'
	}],
	dockedItems : [{
		xtype : 'box',
		dock : 'top',
		height : 25,
		padding : 5,
		html : 'Important: Cross domain file upload is limited. There is no direct way to parse the response!For this example to work server and client code should be hosted on the same domain including port!'
	}],
	tbar : [{
		text : 'Upload..',
		disabled : true,
		handler : function(btn) {

			btn.up('form').getForm().submit({
				waitMsg : 'Uploading your photo...',

				callback : function(fp, o) {

				},

				success : function(fp, o) {
					Ext.Msg.alert('Success', 'Your photo "' + o.result.name + '" has been uploaded.<br> File size:' + o.result.size + ' bytes.');
				},

				failure : function(form, action) {
					console.log(arguments);
					Ext.MessageBox.show({
						title : 'EXCEPTION',
						msg : 'Erro ao carregar o arquivo',
						icon : Ext.MessageBox.ERROR,
						buttons : Ext.Msg.OK
					});
				}
			});
		}
	}, {
		text : 'Upload shapefile',
		handler : function(btn) {

			btn.up('form').getForm().submit({
				waitMsg : 'Uploading your shapefile ...',

				callback : function(fp, o) {

				},

				success : function(fp, o) {
					Ext.Msg.alert('Success', 'Your shapefile "' + o.result.name + '" has been uploaded.<br> File size:' + o.result.size + ' bytes.');
				},

				failure : function(form, action) {
					console.log(arguments);
					Ext.MessageBox.show({
						title : 'EXCEPTION',
						msg : 'Erro ao carregar o arquivo',
						icon : Ext.MessageBox.ERROR,
						buttons : Ext.Msg.OK
					});
				}
			});
		}
	}]
});
