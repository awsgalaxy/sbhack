using System.Collections.Generic;
using System.Threading.Tasks;
using Models.Package;
using Models.Sensors;

namespace Models.Services
{
    public interface IPackageService
    {
        Task<string> CreatePackage(PackageInfo info);
        Task<IEnumerable<PackageState>> GetSensosrsDataByTrackNumber(string trackingNumber);
        Task<PackageInfo> GetPackageByDeviceKey(string deviceId);
        Task<PackageInfo> GetPackageInfoByTrackNumber(string trackNumber);
        Task<IEnumerable<SensorRawData>> GetAllSensorsData();
    }
}