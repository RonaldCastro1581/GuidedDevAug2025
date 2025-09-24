 define("FileDetailV2", ["css!MLCFileDetailV2Style"],
	function() {
	return {
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "DataGrid",
				"parentName": "Detail",
				"propertyName": "items",
				"values": {
					"activeRowActions": [],
					"activeRowAction": {"bindTo": "onActiveRowAction"}
				}
			},
			{
				"operation": "insert",
				"name": "DataGridActiveRowMarkAsSpamButton",
				"parentName": "DataGrid",
				"propertyName": "activeRowActions",
				"values": {
					"className": "Terrasoft.Button",
					"style": Terrasoft.controls.ButtonEnums.style.GREEN,
					"caption": "Preview",
					"tag": "previewButton",
					"visible" : {"bindTo" : "isActivateButtonVisible"}
				}
			},
		],
		/**SCHEMA_DIFF*/
		methods: {
			/*onDataChanged:function(){
				this.callParent(arguments);
				this.addSelectCustomerButton(this.$SchemaName);
			},
			
			addSelectCustomerButton: function(SchemaName) {
				var id = '#grid-'+SchemaName+'DataGridGrid-wrap';
				var baseSelector = id+' div.grid-primary-column';
				
				var attachmentName = "";
				var backgroundImageUrl = this.Terrasoft.ImageUrlBuilder.getUrl(this.get("Resources.Images.MLCPreviewImage"));
				var object = {
					class:'grid-cols-4',
				};
				
				$(baseSelector).each(function() {
					attachmentName = $( this ).text();
					var supportingFileExtention = ["pdf","txt","json","png", "jpeg", "jpg", "gif", "ico", "pjp", "pjpeg", "jfif", "bmp", "xbm", "dib", "jfif", "mp3", "wav", "mp4"];
					
					var index = attachmentName.lastIndexOf(".");
                	var fileExtention = attachmentName.substring(index +1).toLowerCase();
					
					var convertWordToPDF;
					Terrasoft.SysSettings.querySysSettingsItem("MLCConvertWordToPDF", function(val) {
						convertWordToPDF = val;
					}, this);
					
					if((convertWordToPDF == true) && (fileExtention =="docx")){
						supportingFileExtention.push(fileExtention);
					}
					
					if (supportingFileExtention.includes(fileExtention)) {
						var selector = $(this).closest('.grid-listed-row');
						
						if(!$(".glb-select-custom-button",selector).is(':visible')){
							var addition = $("<div>", object);
							addition.html('<span class="glb-select-custom-button">Preview</span>');
							$(selector).append(addition);
						}
					}
				});
				
				
				var scope = this;
				$(".glb-select-custom-button",$(id)).unbind().click(function(){
					var recordId = "";
					try {
						recordId = arguments[0].currentTarget.offsetParent.offsetParent.attributes.id.value.split("item-")[1];
					} catch(e) {}
					if (recordId) {
						scope.onSelectCustomerButtonClick(recordId);
					} else {
						scope.error("Active row id was not found");
					}
				});
			},
			
			onSelectCustomerButtonClick: function(recordId) {
				var baseUrl = Terrasoft.workspaceBaseUrl;
				var attachmentId = recordId;
				var entityName = this.entitySchemaName;
				var apiUrl = baseUrl+'/rest/MLCAttachmentPreviewService/GetAttachmentPreview?attachmentId=' + attachmentId+'&entityName='+entityName;
				window.open(apiUrl, '_blank');	
			},*/
			
			addColumnLink: function(item) {
				var self = this;
				item.isActivateButtonVisible = function() {
					
					var attachmentName = this.get("Name");
					var supportingFileExtention = ["pdf","txt","json","png", "jpeg", "jpg", "gif", "ico", "pjp", "pjpeg", "jfif", "bmp", "xbm", "dib", "jfif", "mp3", "wav", "mp4"];
					
					var index = attachmentName.lastIndexOf(".");
                	var fileExtention = attachmentName.substring(index +1).toLowerCase();
					
					var convertWordToPDF;
					Terrasoft.SysSettings.querySysSettingsItem("MLCConvertWordToPDF", function(val) {
						convertWordToPDF = val;
					}, this);
					
					if((convertWordToPDF == true) && (fileExtention =="docx")){
						supportingFileExtention.push(fileExtention);
					}
					
					var visible = false;
					
					if (supportingFileExtention.includes(fileExtention)) {
						visible = false;
					} else {
						visible = true;
					}
					
					return self.isActivateButtonVisible.call(self,visible);
				};
				return this.callParent(arguments);
				
			},
			
			isActivateButtonVisible: function(value) {
				return !value;
			},
			onActiveRowAction: function (buttonTag) {
				var baseUrl = Terrasoft.workspaceBaseUrl;
				var attachmentId = this.get("ActiveRow");
				var entityName = this.entitySchemaName;
				switch (buttonTag) {
					case "previewButton":
						var apiUrl = baseUrl+'/rest/MLCAttachmentPreviewService/GetAttachmentPreview?attachmentId=' + attachmentId+'&entityName='+entityName;
						window.open(apiUrl, '_blank');	
				}
			}
		},
	};
});