const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questinCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById("score");
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion={};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions=[];

let questions = [];
fetch(
    'https://opentdb.com/api.php?amount=10&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const Max_QUESTIONS = 3;


startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= Max_QUESTIONS){
        window.localStorage.setItem("mostRecentScore",score);
        //go to the end page
        return window.location.assign("/end.html");
    }
    questionCounter++;
    questinCounterText.innerText = `${questionCounter}/${Max_QUESTIONS}`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};


choices.forEach(choice => {
    choice.addEventListener('click', e=>{ 
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let ClassToApply = 'incorrect';
        if(selectedAnswer == currentQuestion.answer){
            ClassToApply = 'correct';
        }

        if(ClassToApply ==='correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(ClassToApply);
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(ClassToApply);
            getNewQuestion();

        },1000)

    })
});

incrementScore = num => {
    score +=num;
    scoreText.innerHTML = score;
}


