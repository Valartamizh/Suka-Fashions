import lehengaMint from '../assets/lehenga_mint.jpg';
import sareeBeigeMaroonFull2 from '../assets/saree_beige_maroon_full2.jpg';
import anarkaliBlackMulticolor from '../assets/anarkali_black_multicolor.jpg';
import dressNavy from '../assets/dress_navy.jpg';
import coordSet from '../assets/coord_set.jpg';
import dupattaSilk from '../assets/dupatta_silk.jpg';
import festiveSuit from '../assets/festive_suit.jpg';

export const categories = [
  {
    id: 'sarees',
    name: 'Sarees',
    image: sareeBeigeMaroonFull2, 
    link: '/category/sarees'
  },
  {
    id: 'kurtis',
    name: 'Kurtis',
    image: anarkaliBlackMulticolor,
    link: '/category/kurtis'
  },
  {
    id: 'lehengas',
    name: 'Lehengas',
    image: lehengaMint,
    link: '/category/lehengas'
  },
  {
    id: 'dresses',
    name: 'Dresses',
    image: dressNavy,
    link: '/category/dresses'
  },
  {
    id: 'coords',
    name: 'Co-ords',
    image: coordSet,
    link: '/category/coords'
  },
  {
    id: 'dupattas',
    name: 'Dupattas',
    image: dupattaSilk,
    link: '/category/dupattas'
  },
  {
    id: 'festive',
    name: 'Festive Wear',
    image: festiveSuit,
    link: '/category/occasion'
  },
  {
    id: 'sale',
    name: 'Sale',
    isSaleBadge: true,
    offerText: 'UP TO 50% OFF',
    link: '/category/sale'
  }
];
