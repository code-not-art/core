const words = require('a-set-of-english-words') as Set<string>;
const wordList = Array.from(words);
const tagger = require('wink-pos-tagger')();

const nounSymbols = ['NN', 'NNP', 'NNS', 'NNPS'];

const adverbSymbols = ['RB']; // Removing awkward comparor adverbs (-er and -est): [, 'RBS', 'RBR']

const adjectiveSymbols = ['JJ', 'JJS', 'JJR'];

export function getWord(ratio: number) {
  return wordList[Math.floor(ratio * wordList.length)];
}

export function getWordOfPosType(ratio: number, types: string[]) {
  let index = Math.floor(ratio * wordList.length);
  while (true) {
    const word = tagger.tagRawTokens([wordList[index]])[0];
    if (types.includes(word.pos)) {
      return word.value as string;
    }
    index++;
  }
  return '';
}

export function getNoun(ratio: number) {
  return getWordOfPosType(ratio, nounSymbols);
}
export function getAdverb(ratio: number) {
  return getWordOfPosType(ratio, adverbSymbols);
}
export function getAdjective(ratio: number) {
  return getWordOfPosType(ratio, adjectiveSymbols);
}
