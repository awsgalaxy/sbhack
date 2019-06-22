using BasicModels.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;
using Models.Sensors;

namespace Models.Devices
{
    public class DeviceInfo : IDBObject
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string DeviceId { get; set; }
        public List<SensorInfo> SensosInfo { get; set; }
    }
}
