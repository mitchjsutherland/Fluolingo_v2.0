import questions from '../vocabulary.json';


async function fetchQuestions (language) {
    return Promise.resolve(questions);
}



export default fetchQuestions;