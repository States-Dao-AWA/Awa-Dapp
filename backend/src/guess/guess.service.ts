import { BadRequestException, Injectable } from '@nestjs/common';
import { isFirst } from './guess.mocks';
import { GuessRequestDto } from './dto/guess.request';
import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import fetch from 'cross-fetch';

const APIURL = 'https://api.thegraph.com/subgraphs/name/yun-sangho/g';

@Injectable()
export class GuessService {
  async guess(guessRequestDto: GuessRequestDto) {
    const { address, number } = guessRequestDto;

    // TODO 1-1. Is this address your first time?, We have to call the smart contract.
    if (!isFirst) {
      throw new BadRequestException('not the first time');
    }

    const dateString = await this.getTodayDate();

    const data = await this.getGraphData(dateString);

    const amounts = await this.getAmounts(data);

    if (!(number < +amounts * 1.05 && number > +amounts * 0.95)) {
      throw new BadRequestException('incorrect');
    }

    // TODO 1-3. If the error range is within 5%, reward is provided. Request contract.
    // TODO Update the status of the user's address. Request contract.
  }

  private async getTodayDate(): Promise<string> {
    const today = new Date();

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
  }

  private async getGraphData(
    dateString: string,
  ): Promise<ApolloQueryResult<any>> {
    const tokensQuery = `query($id: String)
      {
        tokenAmount(id: $id) {
          id
          amount
        }
      }`;

    const client = new ApolloClient({
      link: new HttpLink({ uri: APIURL, fetch }),
      cache: new InMemoryCache(),
    });

    const data = await client.query({
      query: gql(tokensQuery),
      variables: {
        id: dateString,
      },
    });

    return data;
  }

  private async getAmounts(data): Promise<number> {
    let result: number;

    if (data.data.tokenAmount.length > 2) {
      result =
        (data.data.tokenAmounts.reduce((a, b) => +a.amount + +b.amount, 0) *
          (15 / 9) *
          0.0416) /
        1440;
    } else {
      result = data.data.tokenAmount.amount
        ? (data.data.tokenAmount.amount * (15 / 9) * 0.0416) / 1440
        : 0;
    }

    return result;
  }
}
