import Chance from 'chance'
import { zipWith } from 'fp-ts/lib/Array'

import { Pod } from './types'

const chance = new Chance()

/**
 * Lots of flower names
 * @see https://en.wikipedia.org/wiki/Hanakotoba
 */
const podNames = [
  'Ajisai',
  'Amaririsu',
  'Amuburoshiā',
  'Anemone',
  'Asagao',
  'Ayame',
  'Bara',
  'Benibara',
  'Bijozakura',
  'Botan',
  'Burūberu',
  'Chūrippu',
  'Ēderuwaisu',
  'Erika',
  'Furījia',
  'Haibīsukasu',
  'Higanbana',
  'Himawari',
  'Hinageshi',
  'Hinagiku',
  'Hyakunichisou',
  'Jasumin',
  'Kānēshon',
  'Keshi',
  'Kigiku',
  'Kiiroibara',
  'Kuchinashi',
  'Kuroyuri',
  'Magunoria',
  'Momoirobara',
  'Oniyuri',
  'Panjī',
  'Rabendā',
  'Renge',
  'Saboten',
  'Sagisō',
  'Sakura',
  'Sayuri',
  'Shion',
  'Shiragiku',
  'Shirayuri',
  'Suikazura',
  'Suisen',
  'Suītopī',
  'Sumire',
  'Suzuran',
  'Tenjikubotan',
  'Tsubaki',
  'Tsutsuji',
  'Wasurenagusa',
  'Yadorigi',
]

/**
 * Give a random name to each Pod in a list
 */
export const namePods = (pods: Pod[]) =>
  zipWith(pods, chance.pickset(podNames, pods.length), (pod, name) => ({ ...pod, name }))
