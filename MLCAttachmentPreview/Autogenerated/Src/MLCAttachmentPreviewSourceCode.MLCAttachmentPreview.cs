using System;
using System.Text;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.ServiceModel.Activation;
using Terrasoft.Core;
using Terrasoft.Web.Common;
using Terrasoft.Web;
using System.Net;
using System.Net.Http;
using Terrasoft.Core.Entities;
using System.Web;
using System.Threading;
using Terrasoft.Core.DB;
using Terrasoft.Common;
using Terrasoft.File;
using Terrasoft.File.Abstractions;
using System.IO;
using Terrasoft.Configuration.MLCPdfConverterNamespace;

namespace Terrasoft.Configuration.MLCAttachmentPreviewNamespace
{
    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class MLCAttachmentPreviewService : BaseService
    {
        [OperationContract]
        [WebInvoke(Method = "GET")]
        public void GetAttachmentPreview(string attachmentId, string entityName)
        {

            try
            {
                Guid recordId = new Guid(attachmentId);
				
				byte[] attachmentData = null;
				/* Get the file with the file locator. */
				var fileLocator = new EntityFileLocator(entityName, recordId);
				IFile file = UserConnection.GetFile(fileLocator);
				/* Read the contents of the file in the content byte array. Remember to free the stream object by utilizing using! */
				using (Stream stream = file.Read())
				{
					attachmentData = stream.ReadToEnd();
				}
				var name = file.Name;
					
                /*EntitySchemaQuery invoiceAttachmentEntitySchemaQuery = new EntitySchemaQuery(UserConnection.EntitySchemaManager, entityName);

                invoiceAttachmentEntitySchemaQuery.AddAllSchemaColumns();
                var invoiceAttachementRecord = invoiceAttachmentEntitySchemaQuery.GetEntity(UserConnection, recordId);
                var attachmentData = invoiceAttachementRecord.GetBytesValue("Data");
                var name = invoiceAttachementRecord.GetTypedColumnValue<string>("Name");*/
				
				if (!(attachmentData.Length > 0))
				{
					throw new Exception("Attachment lenght is zero");
				}
                var contentType = MimeMapping.GetMimeMapping(name);

                var index = name.LastIndexOf(".");
                var fileExtention = name.Substring(index + 1);
                if(fileExtention == "docx")
                {
                    MLCPdfConverter pdfConverter = new MLCPdfConverter(UserConnection);
                    attachmentData = pdfConverter.ConvertPdf(attachmentData);
                    contentType = "application/pdf";
                }
                
                //Write byteArray to httpContext
                HttpContext context = HttpContext.Current;
                context.Response.Clear();
                context.Response.ClearHeaders();
                context.Response.AppendHeader("Content-Disposition", "inline; filename=" + name);
                context.Response.BinaryWrite(attachmentData);
                context.Response.ContentType = contentType;
                context.Response.AddHeader("Content-Length", attachmentData.Length.ToString());
                context.Response.Flush();
                Thread.Sleep(1000);
                context.Response.End();
            }
            catch (Exception ex)
            {
                HttpContext.Current.Response.ContentType = "text/plain";
                HttpContext.Current.Response.StatusCode = 200;
                HttpContext.Current.Response.Write(ex.Message);
            }
        }
    }
}
