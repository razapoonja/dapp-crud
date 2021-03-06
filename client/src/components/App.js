import React, { Component } from "react";
import Web3 from 'web3'
import Crud from "../contracts/Crud.json";
import Main from './Main'

import "./App.css";

class App extends Component {

  async componentWillMount() {
    document.title = 'DAPP CRUD'

    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId =  await web3.eth.net.getId()

    const crudData = Crud.networks[networkId]
    if(crudData) {
      const crud = new web3.eth.Contract(Crud.abi, crudData.address)
      this.setState({ crud })
    } else {
      window.alert('Crud contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  create = (name) => {
    this.setState({ loading: true })

    this.state.crud.methods.create(name).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  read = (id) => {
    this.setState({ loading: true })

    this.state.crud.methods.read(id).call().then(result => {
      this.setState({ loading: false })
  
      alert(result[1])
    })
  }

  update = (id, name) => {
    this.setState({ loading: true })

    this.state.crud.methods.update(id, name).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  destroy = (id) => {
    this.setState({ loading: true })

    this.state.crud.methods.destroy(id).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        create={this.create}
        read={this.read}
        update={this.update}
        destroy={this.destroy}
      />
    }

    return (
      <div>
        {/* Navbar */}

        <br/>
        <br/>

        <main className="container">
          {content}
        </main>

      </div>
    );
  }
}

export default App;
