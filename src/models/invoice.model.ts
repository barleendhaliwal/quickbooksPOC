import {Entity, model, property} from '@loopback/repository';

@model()
export class Invoice extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'date',
    required: true,
  })
  startDate: Date;

  @property({
    type: 'date',
    required: true,
  })
  endDate: Date;

  @property({
    type: 'string',
    required: true,
  })
  projectCode: string;

  @property({
    type: 'number',
    required: true,
  })
  subTotal: number;

  @property({
    type: 'string',
    required: true,
  })
  customerId: string;

  @property({
    type: 'number',
    required: true,
  })
  balance: number;

  @property({
    type: 'number',
    required: true,
  })
  totalAmount: number;

  @property({
    type: 'string',
    required: true,
  })
  currency: string;

  constructor(data?: Partial<Invoice>) {
    super(data);
  }
}

export interface InvoiceRelations {
  // describe navigational properties here
}

export type InvoiceWithRelations = Invoice & InvoiceRelations;
