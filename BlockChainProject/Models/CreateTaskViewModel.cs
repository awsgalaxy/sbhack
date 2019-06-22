using Models.Devices;
using Models.Sensors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BlockChainProject.Models
{
    public class CreateTaskViewModel
    {
        public IEnumerable<Device> Devices { get; set; }
        public IEnumerable<Sensor> Sensors { get; set; }
    }
}
