using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BasicModels.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Sensors;
using Models.Services;

namespace BlockChainProject.Controllers
{
    public class ValuesController : ControllerBase
    {
        IPackageService _packageService;
        public ValuesController(IPackageService packageService)
        {
            _packageService = packageService;
        }
        // GET api/values
        [HttpGet]
        public Task<IEnumerable<SensorRawData>> GetAllSensorsData()
        {
            return _packageService.GetAllSensorsData();
        }
    }
}
