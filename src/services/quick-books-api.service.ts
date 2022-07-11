import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {
  accessToken,
  clientId,
  clientSecret,
  refreshToken,
} from './quick-books-o-auth.service';
const QuickBooks = require('node-quickbooks');

@injectable({scope: BindingScope.TRANSIENT})
export class QuickBooksApiService {
  constructor(/* Add @inject to inject parameters */) {}

  async getInvoice(id: string, realmId: string) {
    const qbo = new QuickBooks(
      clientId,
      clientSecret,
      accessToken,
      false,
      realmId,
      true,
      false,
      null,
      '2.0',
      refreshToken,
    );

    return new Promise((resolve, reject) => {
      qbo.getInvoice(id, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  async getCustomer(id: string, realmId: string) {
    const qbo = new QuickBooks(
      clientId,
      clientSecret,
      accessToken,
      false,
      realmId,
      true,
      false,
      null,
      '2.0',
      refreshToken,
    );
    return new Promise((resolve, reject) => {
      qbo.getCustomer(id, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  createCustomer(customer: Object, realmId: string) {
    const qbo = new QuickBooks(
      clientId,
      clientSecret,
      accessToken,
      false,
      realmId,
      true,
      false,
      null,
      '2.0',
      refreshToken,
    );
    return new Promise((resolve, reject) => {
      qbo.createCustomer(customer, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          console.log('customer created !');
          resolve(res);
        }
      });
    });
  }
}
