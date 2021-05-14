pragma solidity ^0.4.17;

contract CampaignFactory{
  address[] public deployedCampaigns;
  
  
  function createCampaign(string title, string description, uint minContribution) public returns (address){
    address newCampaign = new Campaign(title, description, minContribution, msg.sender);
    deployedCampaigns.push(newCampaign);
  }
  
  function getDeployedCampaigns() public view returns (address[]){
    return deployedCampaigns;
  }
}

contract Campaign{
  struct Request{
    string description;
    uint value;
    address recipient;
    uint approvalCount;
    mapping(address => bool) approvals;
    bool isCompleted;
      
  }
    
  address public manager;
  string public title;
  string public description;
  uint public minimumContribution;
  mapping(address=>bool) public approvers;
  uint public approversCount;
  Request[] public requests;

  modifier restricted{
    require(msg.sender == manager);
    _;
  }

  
  function Campaign(string _title, string _description, uint minContribution, address sender) public{
    title = _title;
    description = _description;
    minimumContribution = minContribution;
    manager = sender;
  }

  
  function contribute() public payable{
    require(msg.value > minimumContribution);
    approvers[msg.sender] = true;
    approversCount++;
  }

    
  function createRequest(string description, uint value, address recipient) public restricted returns(uint) {
    Request memory newRequest = Request({
        description: description,
        value: value,
        recipient: recipient,
        approvalCount: 0,
        isCompleted: false
    });
    
    requests.push(newRequest);
    
    return requests.length - 1;
  }
  

  function approveRequest(uint requestId) public{
      
    Request storage request = requests[requestId];
    
    require(approvers[msg.sender]);
    require(!request.approvals[msg.sender]);
    
    request.approvals[msg.sender] =  true;
    request.approvalCount++;
      
  }

  
  function finalizeRequest(uint requestId) public restricted{
    Request storage request = requests[requestId];
    require(!request.isCompleted);
    require(request.approvalCount > (approversCount / 2));
    request.isCompleted = true;
    request.recipient.transfer(request.value);
  }


  function getSummary() public view returns (
    string, string, uint, uint, uint, uint, address
  ){
    return (
      title, 
      description,
      minimumContribution,
      this.balance,
      requests.length,
      approversCount,
      manager
    );
  }


  function getRequestsCount() public view returns (uint) {
    return requests.length;
  }
    
}