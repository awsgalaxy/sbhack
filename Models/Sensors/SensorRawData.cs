using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Sensors
{
    public class SensorRawData
    {
        public double Lng { get; set; }
        public double Lat { get; set; }
        public bool IsAcceptableMeasure { get; set; }
    }
}
