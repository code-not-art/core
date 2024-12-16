import words from 'a-set-of-english-words';
import posTagger from 'wink-pos-tagger';
const tagger = new posTagger();

const wordList = Array.from(words);

const nounSymbols = ['NN', 'NNP', 'NNS', 'NNPS'];

const adverbSymbols = ['RB']; // Removing awkward comparator adverbs (-er and -est): [, 'RBS', 'RBR']

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

    // Edgecase for getting to end of list, wrap around to beginning
    if (index >= wordList.length) {
      index = 0;
    }
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
