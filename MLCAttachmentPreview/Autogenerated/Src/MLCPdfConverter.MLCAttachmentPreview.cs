using Aspose.Words.Cloud.Sdk;
using Aspose.Words.Cloud.Sdk.Model.Requests;
using System;
using System.IO;
using System.Threading.Tasks;
using Terrasoft.Common;
using Terrasoft.Core;
using Terrasoft.Core.Factories;

namespace Terrasoft.Configuration.MLCPdfConverterNamespace
{
	public class MLCPdfConverter
	{

		private const string FORMAT = "pdf";
		private const string API_KEY = "MLCAsposeAPIKey";
		private const string APP_SID = "MLCAsposeAppSID";

		private UserConnection _userConnection;

		private string TryGetSettingValue(string settingCode)
		{
			string settingValue = Core.Configuration.SysSettings.GetValue(_userConnection, settingCode, string.Empty);
			if (string.IsNullOrWhiteSpace(settingValue))
			{
				throw new ArgumentNullOrEmptyException($"System settings {settingCode}");
			}
			return settingValue;
		}

		public MLCPdfConverter(UserConnection userConnection)
		{
			_userConnection = userConnection;
		}

		public byte[] ConvertPdf(byte[] data)
		{
			try
			{
                string apiKey = TryGetSettingValue(API_KEY);
                string appSID = TryGetSettingValue(APP_SID);
                var inputFileStream = new MemoryStream(data);
                WordsApi asposeCloudWordsApi = new WordsApi(apiKey, appSID);
                ConvertDocumentRequest convertDocumentRequest = new ConvertDocumentRequest(inputFileStream, FORMAT);
                Task<Stream> convertResult = asposeCloudWordsApi.ConvertDocument(convertDocumentRequest);
                return convertResult.Result.ReadAllBytes();
			}
			catch(Exception ex)
			{
				throw new Exception("Error occured while converting to PDF - " + ex.Message);
			}
			
		}
	}

}


