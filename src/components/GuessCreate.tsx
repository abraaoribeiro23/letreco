import { GuessLetter, GuessListProps } from "../models";
import { completeArray } from "../utils";
import { CREATE_GUESS_LIST_SIZE, CREATE_WORD_SIZE } from "./CreateGame";
import GuessLetterView from "./GuessLetterView";

const completeLetter = (guesses: GuessLetter[][]) => {
  return [
    ...guesses, ...Array(CREATE_GUESS_LIST_SIZE - guesses.length).fill([]),
  ].map(
    (guess, index) => completeArray<GuessLetter>(
      guess,
      CREATE_WORD_SIZE,
      {letter: '', state: (index === guesses.length - 1 ? 'typing' : 'disabled')}
    ),
  );
}

function GuessCreate(props: GuessListProps) {
  const allGuesses = completeLetter(props.guesses)
    .map((guess, guessIndex) => {
      return (
        <div
          key={guessIndex}
          className="d-flex justify-content-center mb-3"
        >
          {guess.map((letter, letterIndex) => (
            <GuessLetterView
              key={guessIndex + '-' + letterIndex}
              letter={letter.letter}
              state={letter.state}
              marginRight={letterIndex !== guess.length - 1}
            />
          ))}
        </div>
      );
    });

  return (
    <div>
      <div>{allGuesses}</div>
    </div>
  );
}

export default GuessCreate;