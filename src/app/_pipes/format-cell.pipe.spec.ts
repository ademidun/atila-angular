import {FormatCellPipe} from './format-cell.pipe';
import {inject} from '@angular/core/testing';
import {CurrencyPipe} from '@angular/common';

describe('FormatCellPipe', () => {
  it('create an instance', inject([CurrencyPipe], (currencyPipe: CurrencyPipe) => {
    const pipe = new FormatCellPipe(currencyPipe);
    expect(pipe).toBeTruthy();
  }));
});
