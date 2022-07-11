// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, post, Request, requestBody, RestBindings} from '@loopback/rest';
import moment from 'moment';
import {InvoiceRepository} from '../repositories';
import {QuickBooksApiService, QuickBooksOAuthService} from '../services';

export class PocController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject('services.QuickBooksOAuthService')
    private quickBooksOAuthService: QuickBooksOAuthService,
    @inject('services.QuickBooksApiService')
    private quickBooksApiService: QuickBooksApiService,
    @repository(InvoiceRepository) private invoiceRepository: InvoiceRepository,
  ) {}

  @get('/oauth-callback')
  async OauthAuthToken() {
    this.quickBooksOAuthService.getAccessToken(this.req.url);
  }

  @post('/webhook')
  webhook(@requestBody() d: any) {
    const data = this.req.body.eventNotifications[0];
    console.log('******WEBHOOK RECEIVED DATA**********\n', data);
    data.dataChangeEvent.entities.forEach(async (invoice: any) => {
      // fetching data
      const details: any = await this.quickBooksApiService.getInvoice(
        invoice.id,
        data.realmId,
      );
      console.log('***************INVOICE DETAILS***************\n ', details);

      const customer = details.CustomerRef;
      const customerDetails = await this.quickBooksApiService.getCustomer(
        customer.value,
        data.realmId,
      );
      console.log(
        '***************CUSTOMER DETAILS**************\n',
        customerDetails,
      );
      const date = this.getDate(
        details.CustomField[0].StringValue,
        details.CustomField[1].StringValue,
      );
      const subTotal = details.Line.find((line: {DetailType: string}) => {
        if (line.DetailType === 'SubTotalLineDetail') {
          return true;
        }
      });
      const payload = {
        id: details.Id,
        startDate: date.startDate,
        endDate: date.endDate,
        projectCode: details.CustomField[2].StringValue,
        subTotal: subTotal.Amount,
        customerId: customer.value,
        balance: details.Balance,
        totalAmount: details.TotalAmt,
        currency: details.CurrencyRef.value,
      };
      const update = await this.invoiceRepository.exists(details.Id);
      if (update) {
        await this.invoiceRepository.updateById(details.Id, payload);
      } else {
        await this.invoiceRepository.create(payload);
      }
    });
  }

  @post('/customer')
  async addCustomer(@requestBody() data: Object) {
    try {
      const customer = await this.quickBooksApiService.createCustomer(
        data,
        '4620816365213766360',
      );
      return customer;
    } catch (err) {
      console.log(err);
    }
  }

  getDate(startDate: string, endDate: string) {
    startDate = startDate.trim();
    endDate = endDate.trim();
    const day1 = moment(startDate, 'DD/MM/YY', true);
    const day2 = moment(endDate, 'DD/MM/YY', true);

    if (!day1.isValid()) {
      //send  notification
      console.log('start date is invalid');
    }
    if (!day2.isValid()) {
      //send  notification
      console.log('end date is invalid');
    }
    const date1 = moment(day1).toDate();
    const date2 = moment(day2).toDate();

    if (date1 > date2) {
      //send  notification
      console.log('date range invalid');
    }

    return {
      startDate: date1,
      endDate: date2,
    };
  }
}
