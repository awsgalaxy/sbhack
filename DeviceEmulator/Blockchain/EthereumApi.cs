using Nethereum.HdWallet;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using System;
using System.Collections.Generic;
using System.Text;

namespace DeviceEmulator.Blockchain
{
    static class EthereumApi
    {
        public static void SendInfo(long uid, string hash)
        {
            var account = GetAccount();
            var web3 = new Web3(account, "https://ropsten.infura.io/v3/e9abbe82a95c47eabd13838aa7d6b9b7");
            var transferHandler = web3.Eth.GetContractTransactionHandler<TrackRecordFunction>();
            var transfer = new TrackRecordFunction
            {
                UID = uid,
                HashedSensorsData = hash
            };
            transfer.Gas = 2000000;
            transfer.GasPrice = 20;
            var transactionReceipt = transferHandler.SendRequestAndWaitForReceiptAsync(DeviceConfig.DeliveryContractAddress, transfer).Result;
            Console.WriteLine($"Sent track record to {DeviceConfig.DeliveryContractAddress} with uid: {uid} hash: {hash} " +
                $"gasUsed: {transactionReceipt.CumulativeGasUsed.Value} thx: {transactionReceipt.TransactionHash}");
        }

        public static void StartDelivery()
        {
            var account = GetAccount();
            var web3 = new Web3(account, "https://ropsten.infura.io/v3/e9abbe82a95c47eabd13838aa7d6b9b7");
            var transferHandler = web3.Eth.GetContractTransactionHandler<StartDeliveryFunction>();
            var transfer = new StartDeliveryFunction();
            transfer.Gas = 2000000;
            transfer.GasPrice = 20;
            var transactionReceipt = transferHandler.SendRequestAndWaitForReceiptAsync(DeviceConfig.DeliveryContractAddress, transfer).Result;
            Console.WriteLine($"Sent start command to {DeviceConfig.DeliveryContractAddress} " +
                $"gasUsed: {transactionReceipt.CumulativeGasUsed.Value} thx: {transactionReceipt.TransactionHash}");
        }

        private static Account GetAccount()
        {
            return new Wallet(DeviceConfig.HDWalletKeyPhrase, null).GetAccount("0x4ddB3924450bBCb36EbB8F43709737151C8565de");
        }
    }
}
