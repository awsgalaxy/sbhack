using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace DeviceEmulator.Blockchain
{
    [Function("trackRecord")]
    class TrackRecordFunction : FunctionMessage
    {
        [Parameter("uint", "uid", 1)]
        public long UID { get; set; }
        [Parameter("string", "hashedSensorsData", 1)]
        public string HashedSensorsData { get; set; }
    }
}
