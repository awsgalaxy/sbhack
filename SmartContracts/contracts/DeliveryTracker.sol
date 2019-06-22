pragma solidity >=0.4.22 <0.6.0;
 
contract DeliveryTracker {
    
    enum DeliveryStatus { CREATED, TRACKING, COMPLETED }
    
    string[] sensorsDataHistory;
    mapping(uint => string) public sensorsData;
    
    DeliveryStatus public deliveryStatus;
    
    string public hashedAssetInfo;
    
    address public owner;
    address public deviceKey;
        
    uint256 public createdDate;
    uint256 public startedDate;
    uint256 public completedDate;
    
    event DeliveryCreated(address deviceKey, string hashedAssetInfo, address operator);
    event DeliveryStarted(address deviceKey, address operator);
    event DeliveryCompleted(address deviceKey, address operator);
    event ReceivedSensorData(address deviceKey, string hashedSensorData, address operator);
    
    constructor(string memory _hashedAssetInfo, address _deviceKey) public {
        hashedAssetInfo = _hashedAssetInfo;
        deviceKey = _deviceKey;
        owner = msg.sender;
        deliveryStatus = DeliveryStatus.CREATED;
        createdDate = now;
        emit DeliveryCreated(deviceKey, hashedAssetInfo, owner);
    }
    
    function startDelivery() public {
        require(msg.sender == deviceKey, "Only attached device can start delivery tracking");
        require(deliveryStatus == DeliveryStatus.CREATED, "Delivery has already been started");
        deliveryStatus = DeliveryStatus.TRACKING;
        startedDate = now;
        emit DeliveryStarted(deviceKey, owner);
    }
    
    function trackRecord(uint uid, string memory hashedSensorsData) public {
        require(msg.sender == deviceKey, "Only attached device can log sensors data");
        require(deliveryStatus == DeliveryStatus.TRACKING, "Sensord logs can be saved only during tracking period");
        sensorsDataHistory.push(hashedSensorsData);
        sensorsData[uid] = hashedSensorsData;
        emit ReceivedSensorData(deviceKey, hashedSensorsData, owner);
    }
    
    function completeDelivery() public {
        require(msg.sender == owner, "Only creator of delivery can complete Delivery");
        require(deliveryStatus == DeliveryStatus.TRACKING, "Delivery can be completed only after tracking mode");
        completedDate = now;
        deliveryStatus = DeliveryStatus.COMPLETED;
        emit DeliveryCompleted(deviceKey, owner);
    }
    
    function getSensorsRecordsCount() public view returns (uint) {
        return sensorsDataHistory.length;
    }
    
    function getSensorsRecord(uint uid) public view returns (string memory) {
        return sensorsData[uid];
    }
    
}