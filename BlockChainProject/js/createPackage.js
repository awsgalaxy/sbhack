
var fileList = [];

$(document).ready(function () {
	SetMenuItemAsActive();

	$('#emails').tagsInput({
		width: 'auto',
		defaultText: "type email"
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
		console.log(data);
		var info = md5(JSON.stringify(data));

		deployDeliveryContract(deviceKey, info, function (address) {
			console.log("callback", address);
			data["smartContractAdress"] = address;

			$.post("/package/createpackage", data);
		})

		e.preventDefault();
	})

	document.getElementById('files').addEventListener('change', handleFileSelect, false);
});

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

function deployDeliveryContract(deviceKey, info, callback) {
	let bytecode = '0x60806040523480156200001157600080fd5b506040516200150438038062001504833981018060405260408110156200003757600080fd5b8101908080516401000000008111156200005057600080fd5b828101905060208101848111156200006757600080fd5b81518560018202830111640100000000821117156200008557600080fd5b5050929190602001805190602001909291905050508160039080519060200190620000b2929190620002d3565b5080600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600260006101000a81548160ff021916908360028111156200015557fe5b0217905550426006819055507f29015e05038bb2ad2b2204f4e0da987f5592267f033bad2dec92adc4b7b619cd600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001806020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828103825284818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015620002bb5780601f106200028f57610100808354040283529160200191620002bb565b820191906000526020600020905b8154815290600101906020018083116200029d57829003601f168201915b505094505050505060405180910390a1505062000382565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200031657805160ff191683800117855562000347565b8280016001018555821562000347579182015b828111156200034657825182559160200191906001019062000329565b5b5090506200035691906200035a565b5090565b6200037f91905b808211156200037b57600081600090555060010162000361565b5090565b90565b61117280620003926000396000f3fe6080604052600436106100c5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630ced083c146100ca5780632a8b8c5a146101035780632d25c0f81461012e57806344fbc893146101595780635b22d520146101845780635d113ed11461019b5780636c47c7be1461022b5780638da5cb5b146102fd578063a0afc42e14610354578063b1b1e1c81461036b578063bd0873aa146103c2578063f1028f01146103ed578063f2d40ae1146104a1575b600080fd5b3480156100d657600080fd5b506100df610555565b604051808260028111156100ef57fe5b60ff16815260200191505060405180910390f35b34801561010f57600080fd5b50610118610568565b6040518082815260200191505060405180910390f35b34801561013a57600080fd5b5061014361056e565b6040518082815260200191505060405180910390f35b34801561016557600080fd5b5061016e61057a565b6040518082815260200191505060405180910390f35b34801561019057600080fd5b50610199610580565b005b3480156101a757600080fd5b506101b0610836565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101f05780820151818401526020810190506101d5565b50505050905090810190601f16801561021d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561023757600080fd5b506102fb6004803603604081101561024e57600080fd5b81019080803590602001909291908035906020019064010000000081111561027557600080fd5b82018360208201111561028757600080fd5b803590602001918460018302840111640100000000831117156102a957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506108d4565b005b34801561030957600080fd5b50610312610c35565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561036057600080fd5b50610369610c5b565b005b34801561037757600080fd5b50610380610f10565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103ce57600080fd5b506103d7610f36565b6040518082815260200191505060405180910390f35b3480156103f957600080fd5b506104266004803603602081101561041057600080fd5b8101908080359060200190929190505050610f3c565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561046657808201518184015260208101905061044b565b50505050905090810190601f1680156104935780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156104ad57600080fd5b506104da600480360360208110156104c457600080fd5b8101908080359060200190929190505050610fec565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561051a5780820151818401526020810190506104ff565b50505050905090810190601f1680156105475780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b600260009054906101000a900460ff1681565b60075481565b60008080549050905090565b60065481565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561066b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260308152602001807f4f6e6c79206174746163686564206465766963652063616e207374617274206481526020017f656c697665727920747261636b696e670000000000000000000000000000000081525060400191505060405180910390fd5b6000600281111561067857fe5b600260009054906101000a900460ff16600281111561069357fe5b14151561072e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001807f44656c69766572792068617320616c7265616479206265656e2073746172746581526020017f640000000000000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b6001600260006101000a81548160ff0219169083600281111561074d57fe5b0217905550426007819055507ff80f24203086cfa9bf639e05aaca59541ad29cb2b2c531a386acf7810c81ee95600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1565b60038054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108cc5780601f106108a1576101008083540402835291602001916108cc565b820191906000526020600020905b8154815290600101906020018083116108af57829003601f168201915b505050505081565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156109bf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260298152602001807f4f6e6c79206174746163686564206465766963652063616e206c6f672073656e81526020017f736f72732064617461000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b600160028111156109cc57fe5b600260009054906101000a900460ff1660028111156109e757fe5b141515610a82576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260358152602001807f53656e736f7264206c6f67732063616e206265207361766564206f6e6c79206481526020017f7572696e6720747261636b696e6720706572696f64000000000000000000000081525060400191505060405180910390fd5b6000819080600181540180825580915050906001820390600052602060002001600090919290919091509080519060200190610abf9291906110a1565b505080600160008481526020019081526020016000209080519060200190610ae89291906110a1565b507fce231b1911199028d8cc10bd42033250b6fadd28d2751677824e87d7efe44087600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001806020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828103825284818151815260200191508051906020019080838360005b83811015610bf5578082015181840152602081019050610bda565b50505050905090810190601f168015610c225780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a15050565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d46576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001807f4f6e6c792063726561746f72206f662064656c69766572792063616e20636f6d81526020017f706c6574652044656c697665727900000000000000000000000000000000000081525060400191505060405180910390fd5b60016002811115610d5357fe5b600260009054906101000a900460ff166002811115610d6e57fe5b141515610e09576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001807f44656c69766572792063616e20626520636f6d706c65746564206f6e6c79206181526020017f6674657220747261636b696e67206d6f6465000000000000000000000000000081525060400191505060405180910390fd5b4260088190555060028060006101000a81548160ff02191690836002811115610e2e57fe5b02179055507f3d0f3f36dd3f2103ec97ad8598debd2b57949a2db3e245c50dc77f5108852818600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60085481565b60016020528060005260406000206000915090508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610fe45780601f10610fb957610100808354040283529160200191610fe4565b820191906000526020600020905b815481529060010190602001808311610fc757829003601f168201915b505050505081565b6060600160008381526020019081526020016000208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110955780601f1061106a57610100808354040283529160200191611095565b820191906000526020600020905b81548152906001019060200180831161107857829003601f168201915b50505050509050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106110e257805160ff1916838001178555611110565b82800160010185558215611110579182015b8281111561110f5782518255916020019190600101906110f4565b5b50905061111d9190611121565b5090565b61114391905b8082111561113f576000816000905550600101611127565b5090565b9056fea165627a7a72305820e5dcf459617f6fb4127a5230fd4ca232db4d3762e7552e00b2924e45d2314c800029';
	ethereum.enable().then(() => {
		let acc = web3.eth.accounts[0];
		web3.eth.estimateGas({ data: bytecode }, function (error, estimatedGas) {
			console.log('Estimated gas', estimatedGas);
			if (error) {
				console.error(error);
				return;
			}
			let deliveryContract = web3.eth.contract(abi);
			let createdDeliveryContract = deliveryContract.new(info, deviceKey, {
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