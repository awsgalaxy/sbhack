using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BasicModels.Interfaces;
using BlockChainProject.Models;
using Microsoft.AspNetCore.Mvc;
using Models.Devices;
using Models.Package;
using Models.Sensors;
using Models.Services;

namespace BlockChainProject.Controllers
{

    public class PackageController : Controller
    {
        IPackageService _packageService;
        IDBAccess<Device> _deviceStore;
        IDBAccess<Sensor> _sensorStore;

        public PackageController(IPackageService packageService,
            IDBAccess<Device> deviceStore,
            IDBAccess<Sensor> sensorStore)
        {
            _packageService = packageService;
            _deviceStore = deviceStore;
            _sensorStore = sensorStore;
        }

        public ActionResult CreatePackage()
        {
            var model = new CreateTaskViewModel()
            {
                Devices = _deviceStore.GetObjectsProperties(d => true, d => d),
                Sensors = _sensorStore.GetObjectsProperties(d => true, d => d),
            };
            return View(model);
        }
        public ActionResult TrackPackage()
        {
            return View();
        }


        [HttpPost]
        public async Task<string> CreatePackage(PackageInfo package)
        {
            return await _packageService.CreatePackage(package);
        }

        [HttpGet]
        public async Task<PackageInfo> GetPackageInfo(string deviceKey)
        {
            return await _packageService.GetPackageByDeviceKey(deviceKey);
        }

        [HttpGet]
        public async Task<PackageInfo> GetPackageInfoByTrackNumber(string trackNumber)
        {
            return await _packageService.GetPackageInfoByTrackNumber(trackNumber);          
        }

        public async Task<IEnumerable<PackageState>> GetPackageHistoryByTrackNumber(string trackNumber)
        {          
            return await _packageService.GetSensosrsDataByTrackNumber(trackNumber);      
        }

        [HttpPost]
        public async Task<IEnumerable<string>> GetSmartContractAdressesByTrackingNumbers(List<string> trackingNumbers)
        {
           return await _packageService.GetSmartContractAdressesByTrackingNumbers(trackingNumbers);
        }
    }
}