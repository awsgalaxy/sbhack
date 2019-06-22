using System.Threading.Tasks;
using Models.Sensors;

namespace Models.Services
{
    public interface ISensorsService
    {
        Task<bool> SaveSensorsData(SensorBatchData data);
    }
}