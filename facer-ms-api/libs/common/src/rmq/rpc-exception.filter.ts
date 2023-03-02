import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export interface IRpcException {
  message: string;
  status: number;
}

export class FitRpcException extends RpcException {
  public statusCode: number;
  constructor(message: string, statusCode: HttpStatus) {
    super(message);
    this.statusCode = statusCode;
  }
}
