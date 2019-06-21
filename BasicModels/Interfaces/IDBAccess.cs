using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BasicModels.Interfaces
{
    public interface IDBAccess<T> where T : IDBObject
    {
        T GetObjectById(string id);

        TResult GetObjectPropertiesById<TResult>(string id, Expression<Func<T, TResult>> selector);

        List<TResult> GetObjectsProperties<TResult>(Expression<Func<T, bool>> predicate, Expression<Func<T, TResult>> selector);

        void Add(T objectToAdd);

        void Update(T objectToUpdate);

        void UpdateProperty<TField>(string id, Expression<Func<T, TField>> selector, TField value);

        void UpdateProperty(string id, string key, object value);

        void Remove(string id);
    }
}
