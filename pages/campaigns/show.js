import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import ContributeForm from '../../components/ContributeForm';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';


class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    // address,
    // title,
    // description,
    // minimumContribution,
    // this.balance,
    // requests.length,
    // approversCount,
    // manager		

    return {
      address: summary[0],
      title: summary[1],
      description: summary[2],
      minimumContribution: summary[3],
      balance: summary[4],
      requestCount: summary[5],
      approversCount: summary[6],
      manager: summary[7],
      
    };
  }

  renderCards() {
    const {
      title,
      description,
      address,
      balance,
      manager,
      minimumContribution,
      requestCount,
      approversCount
    } = this.props;

    const items = [
      
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (Wei)',
        description: 'You must contribute at least this much wei to become an approver'
      },
      {
        header: approversCount,
        meta: 'Approvers Count',
        description: 'Number of contributers to this campaign. Also responsible for approving request'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (Ether)',
        description: 'Total balance available within this campaign'
      },
      {
        header: requestCount,
        meta: 'Requests Count',
        description: 'Campaign creator must raise a request in order to consume campaign balance'
      },
      {
        header: address,
        meta: 'Address of Campaign',
        description: 'The address of contract that hosts this campaign',
        style: { overflowWrap: 'break-word'}
      },
      {
        header: manager,
        meta: 'Address of manager',
        description: 'The manager created this campaign and can create request to withdraw money',
        style: { overflowWrap: 'break-word'}
      },

    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <Link route={`/`}>
          <a>Back</a>
        </Link>
        <h3>{this.props.title}</h3>
        <p>{this.props.description}</p>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a><Button primary>Requests</Button></a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}

export default CampaignShow;