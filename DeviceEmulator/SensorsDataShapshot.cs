using Models.Sensors;
using System;
using System.Collections.Generic;
using System.Text;

namespace DeviceEmulator
{
    static class SensorsDataShapshot
    {
        public static SensorBatchData GetData()
        {
            return new SensorBatchData
            {
                TrackNumber = DeviceConfig.PackageInfo.TrackNumber,
                UID = (long)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds,
                DeviceKey = DeviceConfig.DeviceKey,
                Date = DateTime.UtcNow,
                Info = new List<SensorInfo>
                {
                    new SensorInfo
                    {
                        SensorId = "5c680232e0051d21645b1dea",
                        Data = RandomHelper.GetRandomTemperature()
                    },
                    new SensorInfo
                    {
                        SensorId = "5c680243e0051d21645b1deb",
                        Data = RandomHelper.GetRandomGeoposition()
                    }
                }
            };
        }
    }
}
