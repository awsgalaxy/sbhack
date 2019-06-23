using DeviceEmulator.Blockchain;
using Models.Package;
using Models.Sensors;
using Nethereum.HdWallet;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Timers;

namespace DeviceEmulator
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Console.WriteLine("Device Started");
                InitDevice();
                StartTracking();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        static void StartTracking()
        {
            Console.WriteLine("Press [Enter] to start delivery tracking");
            EthereumApi.StartDelivery();
            while (true)
            {
                Console.WriteLine("Press [Enter] to track current data:");
                Console.ReadLine();
                var currentData = SensorsDataShapshot.GetData();
                var hash = CryptoHelper.MD5(JsonConvert.SerializeObject(currentData));
                EthereumApi.SendInfo(currentData.UID, hash);
                SaveSensorsInfo(currentData);
            }
        }

        static void ScheduleDataTracking()
        {
            var timer = new Timer();
            timer.Elapsed += new ElapsedEventHandler(ElapsedTimerEventHandler);
            timer.Interval = 1000;
            timer.Enabled = true;
        }

        static void ElapsedTimerEventHandler(object sender, ElapsedEventArgs args)
        {
            var currentData = SensorsDataShapshot.GetData();
            var hash = CryptoHelper.MD5(JsonConvert.SerializeObject(currentData));
        }

        static void InitDevice()
        {
            LoadConfig();
        }

        static void LoadConfig()
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri(DeviceConfig.ApiUrl);
            var resp = client.GetAsync($"/package/getpackageinfo?deviceKey={DeviceConfig.DeviceKey}").Result;
            resp.EnsureSuccessStatusCode();
            var packageInfo = JsonConvert.DeserializeObject<PackageInfo>(resp.Content.ReadAsStringAsync().Result);
            Console.WriteLine(JsonConvert.SerializeObject(packageInfo));
            DeviceConfig.DeliveryContractAddress = packageInfo.SmartContractAdress;
            DeviceConfig.PackageInfo = packageInfo;
        }

        static void SaveSensorsInfo(SensorBatchData data)
        {
            var json = JsonConvert.SerializeObject(data);
            var client = new HttpClient();
            client.BaseAddress = new Uri(DeviceConfig.ApiUrl);
            var payload = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            var response = client.PostAsync($"api/sensors/AddSensorsInfo", payload).Result;
            response.EnsureSuccessStatusCode();
            Console.WriteLine($"Successfully uploaded data {json} to central database");
        }
    }
}
