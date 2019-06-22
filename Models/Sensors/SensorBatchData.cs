using BasicModels.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Sensors
{
    public class SensorBatchData : IDBObject
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string TrackNumber { get; set; }
        public long UID { get; set; }
        public string DeviceKey { get; set; }
        public DateTime Date { get; set; }

        public IEnumerable<SensorInfo> Info { get; set; }
    }
}
