import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class RequestRow extends Component {

  state = {
    approvalLoading: false,
    finalizeLoading: false
  };

  onApprove = async event => {
    this.setState({ approvalLoading: true });
    try {
      const campaign = Campaign(this.props.address);

      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(this.props.id)
        .send({
          from: accounts[0]
        });
    } catch (err) {

    } finally {
      this.setState({ approvalLoading: false });
    }
  }

  onFinalize = async event => {
    this.setState({ finalizeLoading: true });
    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.finalizeRequest(this.props.id)
        .send({
          from: accounts[0]
        });
    } catch (err) {

    } finally {
      this.setState({ finalizeLoading: false });
    }
  }

  render() {

    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = approversCount / 2 < request.approvalCount;

    return (
      <Row disabled={request.isCompleted}
          positive={readyToFinalize && !request.isCompleted}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>
        <Cell>
          {request.isCompleted ? null : (
            <Button
              color="green"
              basic
              loading={this.state.approvalLoading}
              onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.isCompleted ? null : (
            <Button
              color="teal"
              basic
              loading={this.state.finalizeLoading}
              onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>

      </Row>
    )
  }
}

export default RequestRow;