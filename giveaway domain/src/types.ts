export interface Transaction {
  id: string;
  location: string;
  flag: string;
  user: string;
  car: string;
  time: string;
  status: 'Confirmed and Dispatched' | 'Pending' | 'Processing';
}

export interface CarOption {
  id: string;
  name: string;
  model: string;
  color: string;
  image: string;
}