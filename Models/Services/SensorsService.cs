using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using BasicModels.Interfaces;
using Models.Sensors;
using Models.Package;
using System.Linq;

namespace Models.Services
{
    public class SensorsService : ISensorsService
    {
        IDBAccess<SensorBatchData> _sensorBatchDataStore;
        IDBAccess<PackageInfo> _packageStore;
        public SensorsService(IDBAccess<SensorBatchData> sensorBatchDataStore,
            IDBAccess<PackageInfo> packageStore)
        {
            _sensorBatchDataStore = sensorBatchDataStore;
            _packageStore = packageStore;
        }

        public Task<bool> SaveSensorsData(SensorBatchData data)
        {
            return Task.Run(() =>
            {
                var trackNumber = _packageStore.GetObjectsProperties(p => p.DeviceKey == data.DeviceKey, p => p.TrackNumber).Last();
                data.TrackNumber = trackNumber; 
                _sensorBatchDataStore.Add(data);
                return true;
            });
        }
    }
}
