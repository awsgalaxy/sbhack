var DeliveryTracker = artifacts.require("./DeliveryTracker.sol");

module.exports = function(deployer) {
  deployer.deploy(DeliveryTracker, "test hash info", "0x4ddB3924450bBCb36EbB8F43709737151C8565de");
};
