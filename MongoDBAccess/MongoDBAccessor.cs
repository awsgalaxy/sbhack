using BasicModels.Interfaces;
using MongoDB.Bson;
using MongoDBAccess.MongoDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace MongoDBAccess
{
    public class MongoDBAccessor<T> : IDBAccess<T> where T : IDBObject
    {
        protected string _collectionName;
        protected DataBases _dbType;

        public MongoDBAccessor(DataBases dbType = DataBases.blockchainproject)
        {
            _collectionName = typeof(T).Name + "s";
            _dbType = dbType;
        }

        void IDBAccess<T>.Add(T objectToAdd)
        {
            objectToAdd.Id = ObjectId.GenerateNewId().ToString();
            MongoDB.MongoDBCollection<T>.GetCollection(_collectionName, _dbType).Find(s => s.Id == objectToAdd.Id).Update(objectToAdd);
        }

        T IDBAccess<T>.GetObjectById(string id)
        {
            return MongoDB.MongoDBCollection<T>.GetCollection(_collectionName, _dbType).Find(s => s.Id == id).Select(s=>s).FirstOrDefault();
        }

        TResult IDBAccess<T>.GetObjectPropertiesById<TResult>(string id, Expression<Func<T, TResult>> selector)
        {
            return MongoDB.MongoDBCollection<T>.GetCollection(_collectionName, _dbType).Find(s => s.Id == id).Select(selector).FirstOrDefault();
        }

        List<TResult> IDBAccess<T>.GetObjectsProperties<TResult>(Expression<Func<T, bool>> predicate, Expression<Func<T, TResult>> selector)
        {
            return MongoDB.MongoDBCollection<T>.GetCollection(_collectionName, _dbType).Find(predicate).Select(selector);
        }

        void IDBAccess<T>.Remove(string id)
        {
            MongoDB.MongoDBCollection<T>.GetCollection(_collectionName, _dbType).Find(s => s.Id == id).Delete();
        }

        void IDBAccess<T>.Update(T objectToUpdate)
        {
            MongoDB.MongoDBCollection<T>.GetCollection(_collectionName, _dbType).Find(s => s.Id == objectToUpdate.Id).Update(objectToUpdate);
        }

        void IDBAccess<T>.UpdateProperty<TField>(string id, Expression<Func<T, TField>> selector, TField value)
        {
            MongoDB.MongoDBCollection<T>.GetCollection(_collectionName, _dbType).Find(s => s.Id == id).UpdateKey(selector,value); 
        }

        void IDBAccess<T>.UpdateProperty(string id, string key, object value)
        {
            MongoDB.MongoDBCollection<T>.GetCollection(_collectionName, _dbType).Find(s => s.Id == id).UpdateKey(key, value);
        }
    }
}
