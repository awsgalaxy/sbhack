using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BasicModels.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Models.Devices;

namespace BlockChainProject.Controllers
{
    public class DeviceController : Controller
    {
        private readonly IDBAccess<Device> _deviceStore;

        public DeviceController(IDBAccess<Device> deviceStore)
        {
            _deviceStore = deviceStore;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string CreateDevice([FromBody] Device device)
        {
            _deviceStore.Add(device);

            return device.DeviceKey;
        }
    }
}