import * as nearAPI from 'near-api-js';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransferContract {
  private readonly privateKey;
  private readonly testnet;

  constructor(private readonly configService: ConfigService) {
    this.privateKey = this.configService.get('CONTRACT_PRIVATE_KEY');
    this.testnet = this.configService.get('TESTNET');
  }

  async getTransferContract() {
    const { keyStores, KeyPair } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY = this.privateKey;
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey('testnet', this.testnet, keyPair);

    const { connect } = nearAPI;

    const config = {
      networkId: 'testnet',
      keyStore,
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
    };
    const near = await connect({ headers: {}, ...config });
    const account = await near.account(this.testnet);

    const contract = new nearAPI.Contract(account, this.testnet, {
      viewMethods: ['ft_balance_of'],
      changeMethods: ['ft_transfer', 'storage_deposit'],
    });
    return contract;
  }
}
