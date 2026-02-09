
import { Holiday } from '../types';

const currentYear = new Date().getFullYear();

export const HOLIDAYS: Holiday[] = [
  { id: 'h1', date: `${currentYear}-01-01`, name: 'New Year Day' },
  { id: 'h2', date: `${currentYear}-01-26`, name: 'Republic Day' },
  { id: 'h3', date: `${currentYear}-05-01`, name: 'May Day' },
  { id: 'h4', date: `${currentYear}-08-15`, name: 'Independence Day' },
  { id: 'h5', date: `${currentYear}-10-02`, name: 'Gandhi Jayanti' },
  { id: 'h6', date: `${currentYear}-12-25`, name: 'Christmas Day' },
];
