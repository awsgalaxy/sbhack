using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace MongoDBAccess.MongoDB
{
    public class MongoDBCollection<T>
    {
        private MongoDBCollection(string collection, DataBases dataBaseType)
        {
            _collection = collection;
            _dataBaseType = dataBaseType;
        }

        private DataBases _dataBaseType;

        public DataBases DataBaseType
        {
            get { return _dataBaseType; }
            private set { _dataBaseType = value; }
        }

        private string _collection;

        public string Collection
        {
            get { return _collection; }
            private set { _collection = value; }
        }

        private Expression<Func<T, bool>> _predicate;

        public static MongoDBCollection<T> GetCollection(string collection, DataBases dataBaseType = DataBases.Main)
        {
            return new MongoDBCollection<T>(collection, dataBaseType);
        }

        public MongoDBCollection<T> Find(Expression<Func<T, bool>> predicate)
        {
            _predicate = predicate;
            return this;
        }

        public List<TResult> Select<TResult>(Expression<Func<T, TResult>> selector)
        {
            var collection = Mongo.Instance.GetDatabase(_dataBaseType).GetCollection<T>(_collection);

            IFindFluent<T, T> finder = null;
            if (_predicate != null)
            {
                finder = collection.Find(_predicate);
            }
            else
            {
                finder = collection.Find(f => true);
            }

            var query = finder.Project(selector);

            return query.ToList();
        }

        public void Update(T toUpdate)
        {
            var collection = Mongo.Instance.GetDatabase(_dataBaseType).GetCollection<T>(_collection);

            collection.ReplaceOne(_predicate, toUpdate, new UpdateOptions()
            {
                IsUpsert = true
            });
        }

        public void UpdateKey<TField>(Expression<Func<T,TField>> selector, TField value)
        {
            var collection = Mongo.Instance.GetDatabase(_dataBaseType).GetCollection<T>(_collection);

            var update = Builders<T>.Update.Set(selector, value);

            collection.UpdateOne(_predicate, update);
        }

        public void UpdateKey(string key, object value)
        {
            var collection = Mongo.Instance.GetDatabase(_dataBaseType).GetCollection<T>(_collection);

            var update = Builders<T>.Update.Set(key, value);

            collection.UpdateOne(_predicate, update);
        }

        public void Delete()
        {
            var collection = Mongo.Instance.GetDatabase(_dataBaseType).GetCollection<T>(_collection);

            collection.DeleteOne(_predicate);
        }
    }

}
