/* jshint esversion: 11 */
define("PageWithTabsFreedomTemplate", /**SCHEMA_DEPS*/["@creatio-devkit/common"]/**SCHEMA_DEPS*/, function/**SCHEMA_ARGS*/(sdk)/**SCHEMA_ARGS*/ {
	return {
		viewConfigDiff: /**SCHEMA_VIEW_CONFIG_DIFF*/[

			{
				"operation": "merge",
				"name": "AttachmentList",
				"values": {
					"type": "crt.FileList",
					"masterRecordColumnValue": "$Id",
					"recordColumnName": "RecordId",
					"layoutConfig": {
						"colSpan": 2,
						"column": 1,
						"row": 1,
						"rowSpan": 6
					},
					"items": "$AttachmentList",
					"primaryColumnName": "AttachmentListDS_Id",
					"columns": [
						{
							"code": "AttachmentListDS_Name",
							"caption": "#ResourceString(AttachmentListDS_Name)#",
							"dataValueType": 28,
							"width": 200
						}
					],
					"viewType": "gallery",
					"tileSize": "small",
					"rowToolbarItems": [
						{
							"type": "crt.MenuItem",
							"caption": "Preview",
							"icon": "open-button-icon",
							"clicked": {
								"request": "mitra.previewButtonClicked",
								"params": {
									"itemsAttributeName": "AttachmentList",
									"recordId": "$AttachmentList.AttachmentListDS_Id",
									"fileName": "$AttachmentList.AttachmentListDS_Name",
									"convertWordToPDF": "$ConvertWordToPDF",
									"dataSourceName":"AttachmentListDS"
								}
							},
						},


						{
							"type": "crt.MenuItem",
							"caption": "DataGrid.RowToolbar.Delete",
							"icon": "delete-row-action",
							"clicked": {
								"request": "crt.DeleteRecordRequest",
								"params": {
									"itemsAttributeName": "AttachmentList",
									"recordId": "$AttachmentList.AttachmentListDS_Id",
								}
							},
						}]
				},
				"parentName": "AttachmentsTabContainer",
				"propertyName": "items",
				"index": 0
			}
		]/**SCHEMA_VIEW_CONFIG_DIFF*/,
		viewModelConfig: /**SCHEMA_VIEW_MODEL_CONFIG*/{
			"attributes": {
				"AttachmentList": {
					"isCollection": true,
					"modelConfig": {
						"path": "AttachmentListDS",
						"sortingConfig": {
							"default": [
								{
									"columnName": "CreatedOn",
									"direction": "desc"
								}
							]
						}
					},
					"viewModelConfig": {
						"attributes": {
							"AttachmentListDS_Name": {
								"modelConfig": {
									"path": "AttachmentListDS.Name"
								}
							},
							"AttachmentListDS_CreatedOn": {
								"modelConfig": {
									"path": "AttachmentListDS.CreatedOn"
								}
							},
							"AttachmentListDS_CreatedBy": {
								"modelConfig": {
									"path": "AttachmentListDS.CreatedBy"
								}
							},
							"AttachmentListDS_Size": {
								"modelConfig": {
									"path": "AttachmentListDS.Size"
								}
							},
							"AttachmentListDS_Id": {
								"modelConfig": {
									"path": "AttachmentListDS.Id"
								}
							}
						}
					}
				},
				"Id": {
					"modelConfig": {
						"path": "#PrimaryDataSourceName()#.Id"
					}
				},
				"ConvertWordToPDF": {}
			}
			
		}/**SCHEMA_VIEW_MODEL_CONFIG*/,
		modelConfig: /**SCHEMA_MODEL_CONFIG*/{
			"dataSources": {
				"AttachmentListDS": {
					"type": "crt.EntityDataSource",
					"scope": "viewElement",
					"config": {
						"entitySchemaName": "SysFile",
						"attributes": {
							"Name": {
								"path": "Name"
							},
							"CreatedOn": {
								"path": "CreatedOn"
							},
							"CreatedBy": {
								"path": "CreatedBy"
							},
							"Size": {
								"path": "Size"
							}
						}
					}
				}
			}
		}/**SCHEMA_MODEL_CONFIG*/,
		handlers: /**SCHEMA_HANDLERS*/[


			{ 
				request : "crt.HandleViewModelInitRequest", 
				handler : async (request,next) => {
					await next?.handle(request);

					var sysSettingsService = new sdk.SysSettingsService();
					var convertWordToPDF = await sysSettingsService.getByCode('MLCConvertWordToPDF');
					
					request.$context.ConvertWordToPDF = convertWordToPDF.value;
					
				}
			},

			

			{
				request: "mitra.previewButtonClicked",
				handler: async (request, next) => {

					var baseUrl = Terrasoft.workspaceBaseUrl;
					var attachmentId = request.recordId;
					var attachmentDS = request.$context.dataSchemas;
					var entityName = attachmentDS[request.dataSourceName].name;
					var apiUrl = baseUrl+'/rest/MLCAttachmentPreviewService/GetAttachmentPreview?attachmentId=' + attachmentId+'&entityName='+entityName;
                    
					var supportingFileExtensions = ["pdf", "txt", "json", "png", "jpeg", "jpg", "gif", "ico", "pjp", "pjpeg", "jfif", "bmp", "xbm", "dib", "jfif", "mp3", "wav", "mp4"];

                    var attachmentName = request.fileName;
                    var index = attachmentName.lastIndexOf(".");
                    var fileExtension = attachmentName.substring(index + 1).toLowerCase();

					var convertWordToPDF = request.convertWordToPDF;

                    if((convertWordToPDF == true) && (fileExtension =="docx")){
						supportingFileExtensions.push(fileExtension);
					}

                    if (supportingFileExtensions.includes(fileExtension)) {
                        window.open(apiUrl, '_blank');
					}
                    else{
                        request.$context.executeRequest({
                            type: "crt.NotificationRequest",
                            message: "Unsupported file format"
                        });
                    }
                    
					return next?.handle(request);
				}
			},




		]/**SCHEMA_HANDLERS*/,
		converters: /**SCHEMA_CONVERTERS*/{}/**SCHEMA_CONVERTERS*/,
		validators: /**SCHEMA_VALIDATORS*/{}/**SCHEMA_VALIDATORS*/
	};
});
