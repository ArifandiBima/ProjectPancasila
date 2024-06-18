async function fetchTextFile(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .catch(error => {
      console.error('There was a problem fetching the text file:', error);
    });
}

const csv2json = (str, delimiter = ';') => {
  const titles = str.slice(0, str.indexOf('\n')).split(delimiter);
  const rows = str.slice(str.indexOf('\n') + 1).split('\n');
  return rows.map(row => {
    const values = row.split(delimiter);
    // console.log(values);
    //console.log(titles.reduce((object, curr, i) => (object[curr] = values[i], object), {}));
    return titles.reduce((object, curr, i) => (object[curr] = values[i], object), {})
  });
};

const csv = './SoalPgl.txt';

const questionElement = document.getElementById("question");
const optionsElements = document.getElementById("options");
const scoreElement = document.getElementById("score");
let questionNumber = 0;
//console.log(questionNumber);
let currentQuestion = Math.floor(Math.random()*5);
let score = 0;

async function showQuestion() {
  let quizData = await fetchTextFile(csv)
  .then(text => {
    //console.log("masuk");
    //console.log(csv2json(text, ";"));
    return csv2json(text, ";");
  });
  
  //console.log(quizData);
  const question = quizData[currentQuestion];
  //console.log(questionNumber);
  const options = [question.option1, question.option2, question.option3, question.option4];
  questionElement.innerText = question.question;

  optionsElements.innerHTML = "";
  options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option;
    optionsElements.appendChild(button);
    // const b1 = document.querySelector('button');
    button.addEventListener("click", selectAnswer);
    button.myParam = quizData;
  });
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const quizData = e.target.myParam;
  //console.log(quizData[currentQuestion]);
  let answer = quizData[currentQuestion].answer.charAt(0);
  //console.log(answer);
  switch (answer) {
    case "1": answer = quizData[currentQuestion].option1;
    break;
    case "2": answer = quizData[currentQuestion].option2;
    break;
    case "3": answer = quizData[currentQuestion].option3;
    break;
    default: answer = quizData[currentQuestion].option4;
    break;
  }
  // console.log(answer);
  // console.log(selectedButton.innerText);

  if (selectedButton.innerText === answer) {
    score++;
  }

  currentQuestion = Math.floor(Math.random() * quizData.length);
  questionNumber++;

  if (questionNumber < 5) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() { 
  questionElement.innerText = "Kuis Selesai"; 
  
  scoreElement.innerHTML="Skor kamu: " +score+" / 5";
  optionsElements.innerHTML = "";
  const button = document.createElement("button");
  button.innerText = "Coba lagi";
  optionsElements.appendChild(button);
  button.addEventListener("click", tryAgain);
}

function tryAgain(){
  questionNumber = 0;
  score=0;
  scoreElement.innerHTML="";
  showQuestion();
}

showQuestion();