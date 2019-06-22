
var fileList = [];

$(document).ready(function () {
	SetMenuItemAsActive();

	$('#relatedShipments').tagsInput({
		width: 'auto',
		defaultText: "type #"
	});

	$(".sensor-checkbox").change(function (e) {
		toggleSensorRow($(this).closest(".row"), !$(this).is(":checked"));
	});

	$("form").submit(function (e) {
		//uploadToIPFS();
		var inputs = $(this).find("input:not([class|=sensor],.sensor-checkbox), select");
		var data = {};
		inputs.each(function (index, value) {
			data[$(value).attr("name")] = $(value).val();
		});
		sensors = $(this).find(".sensor-checkbox:not([disabled])");
		sensorData = [];
		sensors.each(function (index, value) {
			var id = $(value).val();
			var min = $("form").find("input[name=" + id + "-minValue]").val();
			var max = $("form").find("input[name=" + id + "-maxValue]").val();

			sensorData.push({ sensorId: id, minValue: min, maxValue: max })
		});
		data["sensorsInfo"] = sensorData;

		var deviceKey = $("select[name=device] option:selected").attr("data-key");
        data['deviceKey'] = deviceKey;
        var relatedShipmentNumbers = $("#relatedShipments").val();

		var parentPackages = relatedShipmentNumbers.split(",");
		data['parentPackages'] = parentPackages;

		console.log(data);
		var info = md5(JSON.stringify(data));
		getRelatedShipmentsAddresses(parentPackages).then(relatedShipments => {
			deployDeliveryContract(deviceKey, info, relatedShipments, function (address) {
				console.log("callback", address);
				data["smartContractAdress"] = address;

				$.post("/package/createpackage", data);
			});
		}).catch(console.error);
		

		e.preventDefault();
	})

	document.getElementById('files').addEventListener('change', handleFileSelect, false);
});

function getRelatedShipmentsAddresses(trackNumbers) {
	return fetch('/package/GetSmartContractAdressesByTrackingNumbers', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(trackNumbers)
	})
	.then(res => res.json());
}

function uploadToIPFS() {
	var fd = new FormData();
	for (var i = 0; i < fileList.length; i++) {
		fd.append('files', fileList[i]);
	}

	$.ajax({
		url: '/ipfs/upload',
		type: 'POST',
		data: fd,
		contentType: false,
		processData: false,
		success: function (resp) {
			debugger;
			console.log(resp);
		}
	});
}

function handleFileSelect(event) {
	//Check File API support
	if (window.File && window.FileList && window.FileReader) {

		var files = event.target.files; //FileList object
		fileList.push(files[0]);
		var output = document.getElementById("result");

		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			//Only pics
			if (!file.type.match('image')) continue;

			var picReader = new FileReader();
			picReader.addEventListener("load", function (event) {
				var picFile = event.target;
				var div = document.createElement("div");
				div.innerHTML = "<img class='thumbnail' src='" + picFile.result + "'" + "title='" + file.name + "'/>";
				output.insertBefore(div, null);
			});
			//Read the image
			picReader.readAsDataURL(file);
		}
	} else {
		console.log("Your browser does not support File API");
	}
}

function SetMenuItemAsActive() {
	$("#add-package-menu-item").addClass("active-sm").addClass("active");
}

function toggleSensorRow(row, enable) {

	var inputs = $(row).find("input:not([type=checkbox])");

	if (enable) {
		inputs.attr("disabled", "disabled")
	}
	else {
		inputs.removeAttr("disabled")
	}
}

let abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "deliveryStatus",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "startedDate",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "createdDate",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "hashedAssetInfo",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "deviceKey",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "completedDate",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "parentDeliveries",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sensorsData",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_hashedAssetInfo",
				"type": "string"
			},
			{
				"name": "_deviceKey",
				"type": "address"
			},
			{
				"name": "_parentDeliveries",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "deviceKey",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "hashedAssetInfo",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "operator",
				"type": "address"
			}
		],
		"name": "DeliveryCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "deviceKey",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "operator",
				"type": "address"
			}
		],
		"name": "DeliveryStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "deviceKey",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "operator",
				"type": "address"
			}
		],
		"name": "DeliveryCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "deviceKey",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "hashedSensorData",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ReceivedSensorData",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "startDelivery",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "uid",
				"type": "uint256"
			},
			{
				"name": "hashedSensorsData",
				"type": "string"
			}
		],
		"name": "trackRecord",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "completeDelivery",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getSensorsRecordsCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "uid",
				"type": "uint256"
			}
		],
		"name": "getSensorsRecord",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = '0x6c62e898ba31c8e2e2e9981cd684d5b522024b68';

var App = {};

$(window).ready(function () {
	initWeb3();
});

function initWeb3() {
	if (window.web3) {
		App.web3Provider = window.web3.currentProvider;
	}
	// If no injected web3 instance is detected, fall back to Ganache
	else {
		alert('oops');
		App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
	}
	web3 = new Web3(App.web3Provider);
}

function deployDeliveryContract(deviceKey, info, parentDeliveries, callback) {
	debugger;
	let bytecode = '0x60806040523480156200001157600080fd5b50604051620016b5380380620016b5833981018060405260608110156200003757600080fd5b8101908080516401000000008111156200005057600080fd5b828101905060208101848111156200006757600080fd5b81518560018202830111640100000000821117156200008557600080fd5b5050929190602001805190602001909291908051640100000000811115620000ac57600080fd5b82810190506020810184811115620000c357600080fd5b8151856020820283011164010000000082111715620000e157600080fd5b5050929190505050826003908051906020019062000101929190620003c0565b5081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008090505b8151811015620001df57600682828151811015156200016457fe5b9060200190602002015190806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050808060010191505062000149565b5033600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600260006101000a81548160ff021916908360028111156200024157fe5b0217905550426007819055507f29015e05038bb2ad2b2204f4e0da987f5592267f033bad2dec92adc4b7b619cd600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001806020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828103825284818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015620003a75780601f106200037b57610100808354040283529160200191620003a7565b820191906000526020600020905b8154815290600101906020018083116200038957829003601f168201915b505094505050505060405180910390a15050506200046f565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200040357805160ff191683800117855562000434565b8280016001018555821562000434579182015b828111156200043357825182559160200191906001019062000416565b5b50905062000443919062000447565b5090565b6200046c91905b80821115620004685760008160009055506001016200044e565b5090565b90565b611236806200047f6000396000f3fe6080604052600436106100d0576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630ced083c146100d55780632a8b8c5a1461010e5780632d25c0f81461013957806344fbc893146101645780635b22d5201461018f5780635d113ed1146101a65780636c47c7be146102365780638da5cb5b14610308578063a0afc42e1461035f578063b1b1e1c814610376578063bd0873aa146103cd578063d9789b05146103f8578063f1028f0114610473578063f2d40ae114610527575b600080fd5b3480156100e157600080fd5b506100ea6105db565b604051808260028111156100fa57fe5b60ff16815260200191505060405180910390f35b34801561011a57600080fd5b506101236105ee565b6040518082815260200191505060405180910390f35b34801561014557600080fd5b5061014e6105f4565b6040518082815260200191505060405180910390f35b34801561017057600080fd5b50610179610600565b6040518082815260200191505060405180910390f35b34801561019b57600080fd5b506101a4610606565b005b3480156101b257600080fd5b506101bb6108bc565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101fb5780820151818401526020810190506101e0565b50505050905090810190601f1680156102285780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561024257600080fd5b506103066004803603604081101561025957600080fd5b81019080803590602001909291908035906020019064010000000081111561028057600080fd5b82018360208201111561029257600080fd5b803590602001918460018302840111640100000000831117156102b457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061095a565b005b34801561031457600080fd5b5061031d610cbb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561036b57600080fd5b50610374610ce1565b005b34801561038257600080fd5b5061038b610f96565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103d957600080fd5b506103e2610fbc565b6040518082815260200191505060405180910390f35b34801561040457600080fd5b506104316004803603602081101561041b57600080fd5b8101908080359060200190929190505050610fc2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561047f57600080fd5b506104ac6004803603602081101561049657600080fd5b8101908080359060200190929190505050611000565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104ec5780820151818401526020810190506104d1565b50505050905090810190601f1680156105195780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561053357600080fd5b506105606004803603602081101561054a57600080fd5b81019080803590602001909291905050506110b0565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156105a0578082015181840152602081019050610585565b50505050905090810190601f1680156105cd5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b600260009054906101000a900460ff1681565b60085481565b60008080549050905090565b60075481565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260308152602001807f4f6e6c79206174746163686564206465766963652063616e207374617274206481526020017f656c697665727920747261636b696e670000000000000000000000000000000081525060400191505060405180910390fd5b600060028111156106fe57fe5b600260009054906101000a900460ff16600281111561071957fe5b1415156107b4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001807f44656c69766572792068617320616c7265616479206265656e2073746172746581526020017f640000000000000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b6001600260006101000a81548160ff021916908360028111156107d357fe5b0217905550426008819055507ff80f24203086cfa9bf639e05aaca59541ad29cb2b2c531a386acf7810c81ee95600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1565b60038054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109525780601f1061092757610100808354040283529160200191610952565b820191906000526020600020905b81548152906001019060200180831161093557829003601f168201915b505050505081565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a45576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260298152602001807f4f6e6c79206174746163686564206465766963652063616e206c6f672073656e81526020017f736f72732064617461000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b60016002811115610a5257fe5b600260009054906101000a900460ff166002811115610a6d57fe5b141515610b08576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260358152602001807f53656e736f7264206c6f67732063616e206265207361766564206f6e6c79206481526020017f7572696e6720747261636b696e6720706572696f64000000000000000000000081525060400191505060405180910390fd5b6000819080600181540180825580915050906001820390600052602060002001600090919290919091509080519060200190610b45929190611165565b505080600160008481526020019081526020016000209080519060200190610b6e929190611165565b507fce231b1911199028d8cc10bd42033250b6fadd28d2751677824e87d7efe44087600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001806020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828103825284818151815260200191508051906020019080838360005b83811015610c7b578082015181840152602081019050610c60565b50505050905090810190601f168015610ca85780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a15050565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610dcc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001807f4f6e6c792063726561746f72206f662064656c69766572792063616e20636f6d81526020017f706c6574652044656c697665727900000000000000000000000000000000000081525060400191505060405180910390fd5b60016002811115610dd957fe5b600260009054906101000a900460ff166002811115610df457fe5b141515610e8f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001807f44656c69766572792063616e20626520636f6d706c65746564206f6e6c79206181526020017f6674657220747261636b696e67206d6f6465000000000000000000000000000081525060400191505060405180910390fd5b4260098190555060028060006101000a81548160ff02191690836002811115610eb457fe5b02179055507f3d0f3f36dd3f2103ec97ad8598debd2b57949a2db3e245c50dc77f5108852818600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60095481565b600681815481101515610fd157fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60016020528060005260406000206000915090508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110a85780601f1061107d576101008083540402835291602001916110a8565b820191906000526020600020905b81548152906001019060200180831161108b57829003601f168201915b505050505081565b6060600160008381526020019081526020016000208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111595780601f1061112e57610100808354040283529160200191611159565b820191906000526020600020905b81548152906001019060200180831161113c57829003601f168201915b50505050509050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106111a657805160ff19168380011785556111d4565b828001600101855582156111d4579182015b828111156111d35782518255916020019190600101906111b8565b5b5090506111e191906111e5565b5090565b61120791905b808211156112035760008160009055506001016111eb565b5090565b9056fea165627a7a72305820149c3c7aad0a2282584b8671e7b49e84f63de3a83c07b991b856ee79c88e5a130029';
	ethereum.enable().then(() => {
		let acc = web3.eth.accounts[0];
		web3.eth.estimateGas({ data: bytecode }, function (error, estimatedGas) {
			console.log('Estimated gas', estimatedGas);
			if (error) {
				console.error(error);
				return;
			}
			let deliveryContract = web3.eth.contract(abi);
			let createdDeliveryContract = deliveryContract.new(info, deviceKey, parentDeliveries, {
				from: acc,
				data: bytecode,
				gas: estimatedGas,
				gasPrice: 20
			}, function (err, deliveryContract) {
				if (!err) {
					console.log('Deployment', deliveryContract)
					if (!deliveryContract.address) {
						console.log('Deployment transaction hash', deliveryContract.transactionHash)
					} else {
						console.log('Deployment transaction address', deliveryContract.address)
						callback(deliveryContract.address)
					}
				}
				else {
					console.log('Err', err)
				}
			});
		})
	});
}

function completeDelivery() {
	web3.eth.contract(abi).at(contractAddress).completeDelivery({
		gas: 2500000
	}, (error, res) => {
		console.log('error', error);
		console.log('res', res);
	});
}