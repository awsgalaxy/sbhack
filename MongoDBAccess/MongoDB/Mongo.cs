using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace MongoDBAccess.MongoDB
{
    public class Mongo
    {
        private Mongo(string connectionString)
        {
            _client = new MongoClient(connectionString);
            _databases = new Dictionary<DataBases, IMongoDatabase>();
        }

        private static Mongo _instance = null;

        public static Mongo Instance
        {
            get
            {
                return _instance;
            }
        }

        public static void Configure(string connectionString)
        {
            _instance = new Mongo(connectionString);
        }

        private MongoClient _client;

        private Dictionary<DataBases, IMongoDatabase> _databases;
        private DateTime? _connectionDate;

        public void RenewConnection()
        {
            if (_connectionDate == null || _connectionDate.Value.AddMinutes(30) < DateTime.Now)
            {
                _connectionDate = DateTime.Now;
                _databases = new Dictionary<DataBases, IMongoDatabase>();
            }
        }

        public IMongoDatabase GetDatabase(DataBases dataBaseType = DataBases.Main)
        {
            RenewConnection();

            if(!_databases.ContainsKey(dataBaseType))
            {
                _databases[dataBaseType] = _client.GetDatabase(dataBaseType.ToString());
            }

            return _databases[dataBaseType];
        }
    }

    public enum DataBases
    {
        blockchainproject,
        Main,
        Logs
    }
}
