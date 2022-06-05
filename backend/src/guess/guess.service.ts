import { BadRequestException, Injectable } from '@nestjs/common';
import { GuessRequestDto } from './dto/guess.request';
import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import fetch from 'cross-fetch';
import { ConfigService } from '@nestjs/config';
import { Contract } from '../contract/contract.class';
import { TransferContract } from '../contract/transfer-contract.class';

@Injectable()
export class GuessService {
  private readonly graphAPI;

  constructor(
    private readonly configService: ConfigService,
    private readonly contract: Contract,
    private readonly transferContract: TransferContract,
  ) {
    this.graphAPI = this.configService.get('GRAPH_API');
  }

  async guess(guessRequestDto: GuessRequestDto) {
    const { address, answer } = guessRequestDto;

    await this.isFirstGuess(address);

    const yesterdayDate = await this.getYesterdayDate();

    const graphData = await this.getGraphData(yesterdayDate);

    const amounts = await this.getAmounts(graphData);

    await this.compareAnswer(answer, amounts);

    await this.transferReward(address);
  }

  private async isFirstGuess(address: string): Promise<void> {
    const contract = await this.contract.getContract();

    const response = await (contract as any).get_user_last_guess({
      owner_id: address,
    });

    if (response) {
      const responseTime = new Date(response);
      const nowTime = new Date();

      const responseDay = ('' + responseTime.getDate()).slice(-2);
      const today = ('' + nowTime.getDate()).slice(-2);

      if (responseDay === today) {
        throw new BadRequestException('not the first time');
      }
    }
  }

  private async getYesterdayDate(): Promise<string> {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
  }

  private async getGraphData(
    yesterdayDate: string,
  ): Promise<ApolloQueryResult<any>> {
    const tokensQuery = `query($id: String)
      {
        tokenAmount(id: $id) {
          id
          amount
        }
      }`;

    const client = new ApolloClient({
      link: new HttpLink({ uri: this.graphAPI, fetch }),
      cache: new InMemoryCache(),
    });

    const data = await client.query({
      query: gql(tokensQuery),
      variables: {
        id: yesterdayDate,
      },
    });

    return data;
  }

  private async getAmounts(graphData): Promise<number> {
    let result: number;

    if (graphData.data.tokenAmount.length > 2) {
      result =
        (graphData.data.tokenAmounts.reduce(
          (a, b) => +a.amount + +b.amount,
          0,
        ) *
          (15 / 9) *
          0.0416) /
        1440;
    } else {
      result = graphData.data.tokenAmount.amount
        ? (graphData.data.tokenAmount.amount * (15 / 9) * 0.0416) / 1440
        : 0;
    }

    return result;
  }

  private async compareAnswer(answer: number, amounts: number): Promise<void> {
    if (!(answer < +amounts * 1.05 && answer > +amounts * 0.95)) {
      if (answer > +amounts) {
        throw new BadRequestException('down');
      }

      if (answer < +amounts) {
        throw new BadRequestException('up');
      }
    }
  }

  private async transferReward(address: string): Promise<void> {
    const transferContract = await this.transferContract.getTransferContract();
    await (transferContract as any).storage_deposit({
      args: {
        account_id: address,
      },
      amount: '1250000000000000000000',
    });

    await (transferContract as any).ft_transfer({
      args: {
        receiver_id: address,
        amount: '50000',
      },
      amount: 1,
    });

    const contract = await this.contract.getContract();

    await (contract as any).set_user_last_guess({
      args: {
        owner_id: address,
        timestamp: Date.now(),
      },
    });
  }
}
