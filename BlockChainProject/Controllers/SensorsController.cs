using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Models.Package;
using Models.Sensors;
using Models.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BlockChainProject.Controllers
{
    public class SensorsController : Controller
    {
        ISensorsService _sensorsService;
        IPackageService _packageService;
        public SensorsController(ISensorsService sensorsService,
            IPackageService packageService)
        {
            _sensorsService = sensorsService;
            _packageService = packageService;
        }

        [HttpPost]
        public async Task<bool> AddSensorsInfo([FromBody] SensorBatchData data)
        {
            await _sensorsService.SaveSensorsData(data);
            return true;
        }
    }
}
