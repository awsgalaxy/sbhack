using System;
using System.Collections.Generic;
using System.Text;

namespace DeviceEmulator
{
    static class RandomHelper
    {
        private static double lat = 10;
        private static double lon = 10;

        public static int GetRandomTemperature()
        {
            var rnd = new Random();
            return rnd.Next(-10, 50);
        }

        public static string GetRandomGeoposition()
        {
            var rnd = new Random();
            lat += rnd.Next(0, 5);
            lon += rnd.Next(-5, 5);

            return $"{lat}:{lon}";
        }
    }
}
