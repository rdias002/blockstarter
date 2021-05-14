import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    title: '',
    description: '',
    minimumContribution: '',
    errorMessage: '',
    loading: false
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true, errorMessage: ''});
    try {
      const accounts = await web3.eth.getAccounts();
      const {
        title,
        description,
        minimumContribution
      } = this.state;

      await factory.methods
        .createCampaign(title, description, minimumContribution)
        .send({ from: accounts[0] });
      Router.pushRoute('/');
    } catch (err) {
      this.setState({errorMessage: err.message });
    } finally {
      this.setState({loading: false});
    }
  };

  render() {
    return (
      <Layout>
        <h1>Create a New Campaign</h1>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
            <label>Title</label>
            <Input
              value={this.state.title}
              onChange={e => this.setState({ title: e.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={e => this.setState({ minimumContribution: e.target.value })}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage}/>
          <Button primary loading={this.state.loading}>Create!</Button>
        </Form>
      </Layout>
    );

  }
}

export default CampaignNew;