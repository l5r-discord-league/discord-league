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
  'Anemone',
  'Asagao',
  'Ayame',
  'Bara',
  'Benibara',
  'Bijozakura',
  'Botan',
  'Erika',
  'Higanbana',
  'Himawari',
  'Hinageshi',
  'Hinagiku',
  'Hyakunichisou',
  'Jasumin',
  'Keshi',
  'Kigiku',
  'Kiiroibara',
  'Kuchinashi',
  'Kuroyuri',
  'Magunoria',
  'Momoirobara',
  'Oniyuri',
  'Renge',
  'Saboten',
  'Sagisou',
  'Sakura',
  'Sayuri',
  'Shion',
  'Shiragiku',
  'Shirayuri',
  'Suikazura',
  'Suisen',
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
export const namePods = (pods: Pod[]): Array<Pod & { name: string }> =>
  zipWith(pods, chance.pickset(podNames, pods.length), (pod, name) => ({ ...pod, name }))
