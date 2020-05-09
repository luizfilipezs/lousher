import { CartProduct } from './cart.product';
import { Product } from './product';

export const cartItems: CartProduct[] = [];

export const offers: Product[] = [
  {
    id: 1,
    nome: 'Malbec Lousher 2020',
    preco: 40,
    qntd_estoque: 100,
    pais: 'Brasil',
    regiao: 'Oeste gaúcho',
    oferta: {
      id: 3,
      descricao: '32 reais | desconto até 17/05',
      preco_oferta: 32,
      vencimento: '17/05/2020'
    },
    tipo: 'Merlot',
    cor: 'Tinto',
    docura: 'Seco',
    classe: 'De mesa',
    sabor: 'Amadeirado'
  },
  {
    id: 2,
    nome: 'Tannat - Safra 2007',
    preco: 50,
    qntd_estoque: 100,
    pais: 'Brasil',
    regiao: 'Oeste gaúcho',
    oferta: {
      id: 5,
      descricao: '35 reais | desconto até 17/05',
      preco_oferta: 35,
      vencimento: '17/05/2020'
    },
    tipo: 'Tannat',
    cor: 'Tinto',
    docura: 'Seco',
    classe: 'De mesa',
    sabor: 'Amadeirado'
  }
]