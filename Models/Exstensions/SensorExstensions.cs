using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Models.Sensors;

namespace Models.Exstensions
{
    public static class SensorExstensions
    {
        public static bool IsSensorOk(this SensorInfo sensor, IEnumerable<SensorData> sensorsData)
        {
            return sensorsData == null || sensorsData.Any(s => s.SensorId == sensor.SensorId && s.MinValue < int.Parse(sensor.Data.ToString()) && s.MaxValue > int.Parse(sensor.Data.ToString())) == true;

        }
    }
}
