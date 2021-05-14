pragma solidity ^0.4.17;

contract CampaignFactory{
	address[] public deployedCampaigns;

	/// Create a new campaign for your new idea
	function createCampaign(
		string title,
		string description,
		uint minContribution
	) public returns (address){

	address newCampaign = new Campaign(
		title,
		description,
		minContribution,
		msg.sender
	);

	deployedCampaigns.push(newCampaign);
}


	function getDeployedCampaigns()
	public view returns (address[]){
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

    function Campaign(
            string _title,
            string _description,
            uint _minContribution,
            address _manager
    ) public{
        title = _title;
        description = _description;
        minimumContribution = _minContribution;
        manager = _manager;
    }

    /// Contribute to this campaign
    /// and become a part of the
    /// decision making process
    function contribute() public payable{
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string _description,
        uint _value,
        address _recipient
    ) public restricted returns(uint) {
        Request memory newRequest = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            approvalCount: 0,
            isCompleted: false
        });

        requests.push(newRequest);

        return requests.length - 1;
    }

        /// Approve the validity of this Request
        /// to spend the campaign's balance
    function approveRequest(uint _requestId) public{

        Request storage request = requests[_requestId];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] =  true;
        request.approvalCount++;

    }

    /// Transfer the amount to the
    /// recipient
    function finalizeRequest(
        uint _requestId
    ) public restricted{
        Request storage request = requests[_requestId];
        require(!request.isCompleted);
        require(request.approvalCount > (approversCount / 2));
        request.isCompleted = true;
        request.recipient.transfer(request.value);
    }

    function getSummary() public view returns (
        address,
		string,
        string,
        uint,
        uint,
        uint,
        uint,
        address
    ){
        return (
			this,
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