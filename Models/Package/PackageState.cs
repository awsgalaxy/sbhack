using Models.Sensors;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Package
{
    public class PackageState
    {
        public IEnumerable<SensorState> Sensors { get; set; }
        public double Lng { get; set; }
        public double Lat { get; set; }
        public DateTime Date { get; set; }
    }
    
    public class SensorState
    {
        public string Name { get; set; }
        public string Data { get; set; }
        public bool IsAcceptableMeasure { get; set; }
    }
}
