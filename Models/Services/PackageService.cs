using BasicModels.Interfaces;
using Models.Package;
using Models.Sensors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models.Exstensions;

namespace Models.Services
{
    public class PackageService : IPackageService
    {
        IDBAccess<SensorBatchData> _sensorBatchDataStore;
        IDBAccess<PackageInfo> _packageStore;
        IDBAccess<Sensor> _sensorStore;

        public PackageService(IDBAccess<SensorBatchData> sensorBatchDataStore,
            IDBAccess<PackageInfo> packageStore,
            IDBAccess<Sensor> sensorStore)
        {
            _sensorBatchDataStore = sensorBatchDataStore;
            _packageStore = packageStore;
            _sensorStore = sensorStore;
        }

        private IEnumerable<string> GetParentTrackNumbers(string trackNumber)
        {
            var numbers = _packageStore.GetObjectsProperties(p => p.TrackNumber == trackNumber, p => p.ParentPackages).Where(p => p != null).SelectMany(p => p).ToList();
            var result = new List<string>();
            foreach (var number in numbers)
            {
                result.AddRange(GetParentTrackNumbers(number));
            }
            result.Add(trackNumber);
            return result;
        }

        public Task<IEnumerable<PackageState>> GetSensosrsDataByTrackNumber(string trackingNumber)
        {
            return Task.Run(() =>
            {
                var allTrackNumbers = GetParentTrackNumbers(trackingNumber);

                var sensorsData = _sensorBatchDataStore.GetObjectsProperties(s => allTrackNumbers.Contains(s.TrackNumber), s => s);
                var sensors = _sensorStore.GetObjectsProperties(s => true, s => s);
                var gpsSensorId = sensors.FirstOrDefault(s => s.Name == "gps")?.Id;
                var packagesData = _packageStore.GetObjectsProperties(p => allTrackNumbers.Contains(p.TrackNumber), p => p);

                return sensorsData.Select(c =>
                {
                    var gpsSensor = c.Info.FirstOrDefault(s => s.SensorId == gpsSensorId);
                    double lat = 0, longitude = 0;

                    var gpsSensorData = gpsSensor?.Data?.ToString().Split(':');
                    if (gpsSensorData.Length == 2)
                    {
                        Double.TryParse(gpsSensorData[0], out lat);
                        Double.TryParse(gpsSensorData[1], out longitude);
                    }

                    var packageData = packagesData.FirstOrDefault(p => p.TrackNumber == c.TrackNumber);

                    return new PackageState()
                    {
                        Lat = lat,
                        Lng = longitude,
                        Date = c.Date,
                        PackageId = packageData.Id, 
                        Sensors = c.Info.Where(s => s.SensorId != gpsSensorId).Select(s => new SensorState()
                        {
                            Data = s.Data.ToString(),
                            Name = sensors.FirstOrDefault(ss => ss.Id == s.SensorId)?.Name,
                            IsAcceptableMeasure = s.IsSensorOk(packageData?.SensorsInfo)
                        })
                    };
                });
            });
        }

        public Task<IEnumerable<SensorRawData>> GetAllSensorsData()
        {
            return Task.Run(() =>
            {
                var sensorsData = _sensorBatchDataStore.GetObjectsProperties(s => true, s => s);
                var sensors = _sensorStore.GetObjectsProperties(s => true, s => s);
                var gpsSensorId = sensors.FirstOrDefault(s => s.Name == "gps")?.Id;
                var packages = _packageStore.GetObjectsProperties(p => true, p => p);

                return sensorsData.SelectMany(c =>
                {
                    var gpsSensor = c.Info.FirstOrDefault(s => s.SensorId == gpsSensorId);
                    double lat = 0, longitude = 0;

                    var gpsSensorData = gpsSensor?.Data?.ToString().Split(':');
                    if (gpsSensorData.Length == 2)
                    {
                        Double.TryParse(gpsSensorData[0], out lat);
                        Double.TryParse(gpsSensorData[1], out longitude);
                    }
                    var package = packages.FirstOrDefault(p => p.TrackNumber == c.TrackNumber);

                    return c.Info.Select(si => new SensorRawData()
                    {
                        Lat = lat,
                        Lng = longitude,
                        IsAcceptableMeasure = si.IsSensorOk(package?.SensorsInfo)
                    });
                });
            });
        }

        public Task<string> CreatePackage(PackageInfo info)
        {
            return Task.Run(() =>
            {
                var trackNumber = Guid.NewGuid().ToString();
                info.TrackNumber = trackNumber;
                _packageStore.Add(info);
                return trackNumber;
            });
        }

        public Task<PackageInfo> GetPackageByDeviceKey(string deviceKey)
        {
            return Task.Run(() =>
            {
                return _packageStore.GetObjectsProperties(p => p.DeviceKey == deviceKey, p => p).Last();
            });
        }

        public Task<PackageInfo> GetPackageInfoByTrackNumber(string trackNumber)
        {
            return Task.Run(() =>
            {
                return _packageStore.GetObjectsProperties(p => p.TrackNumber == trackNumber, p => p).FirstOrDefault();
            });
        }

        public Task<List<string>> GetSmartContractAdressesByTrackingNumbers(IEnumerable<string> trackingNumbers)
        {
            return Task.Run(() =>
            {
                return _packageStore.GetObjectsProperties(p => trackingNumbers.Contains(p.TrackNumber), p => p.SmartContractAdress);
            });
        }
    }
}
