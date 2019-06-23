using Models.Package;
using System;
using System.Collections.Generic;
using System.Text;

namespace DeviceEmulator
{
    public static class DeviceConfig
    {
        public static string HDWalletKeyPhrase { get; set; } = "rug field toilet example general artefact ozone stick gun enable rib hurt";
        public static string ApiUrl { get; set; } = "https://localhost:44388/";
        public static string DeliveryContractAddress { get; set; }
        public static string DeviceKey { get; set; } = "0x4ddB3924450bBCb36EbB8F43709737151C8565de";
        public static PackageInfo PackageInfo { get; set; }
    }
}
