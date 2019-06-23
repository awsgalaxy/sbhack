using BasicModels.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Models.Sensors;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Package
{
    [BsonIgnoreExtraElements]
    public class PackageInfo : IDBObject
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string ShipmentId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime ProductionDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Producer { get; set; }
        public IEnumerable<SensorData> SensorsInfo { get; set; }
        public string DeviceKey { get; set; }
        public string OperatorId { get; set; }
        public string TrackNumber { get; set; }
        public string SmartContractAdress { get; set; }
        public List<string> ParentPackages { get; set; }
    }
}
