let dataForm = document.getElementById('data-form');
let submitForm = document.querySelector('#submit-form');
let numberOfQ = document.getElementById('numofQ');
let category = document.getElementById('category');
let difficulty = document.getElementById('difficulty');
let questionType = document.getElementById('type');
let loading = document.querySelector('.loading');
let questions = document.querySelector('.question-box');
let questionList = document.querySelector('.question-list')
let score = 0;
let result;
let newQuiz = document.createElement('button')
newQuiz.innerHTML = 'Take Another Quiz'
newQuiz.classList.add('new-quiz') 
let submitBtn = document.createElement('button');
dataForm.addEventListener('submit', (e) =>{
e.preventDefault()
 let inputControl = numberOfQ.parentElement; 
   if(numberOfQ.value === ''){

        setError(inputControl, 'cannot be empty')
    } else if(isNaN(numberOfQ.value)) {
        setError(inputControl, 'numbers only')
    }
    else{
        setSuccess(inputControl)
        dataForm.style.display = 'none'
        loading.style.display = 'block'
        questions.style.display = 'block'
        
       fetchQuestions(numberOfQ.value,category.options[category.selectedIndex].getAttribute('data-index'),
            difficulty.value, questionType.options[questionType.selectedIndex].getAttribute('data-type'))
    }
})

function setError(elem, message) {
    elem.classList.remove('success')
    elem.classList.add('error')
    let errorMessage = elem.querySelector('.err-message')
    errorMessage.innerHTML = message;
}

function setSuccess(elem) {
    elem.classList.remove('error')
    elem.classList.add('success')
    
    let errorMessage = elem.querySelector('.err-message')
    errorMessage.innerHTML = '';
}

function fetchQuestions(nOfQ, category, difficulty, type) {
    let request = new XMLHttpRequest();
    request.addEventListener('readystatechange',()=>{
        if(request.readyState == 4 && request.status == 200) {
            loading.style.display = "none";
            
            submitBtn.innerHTML = "Submit"
            submitBtn.setAttribute('id','submit')
            questions.appendChild(submitBtn);
        let response = JSON.parse(request.responseText);
            result = response.results;
     
            result.forEach(elem =>{
            
                let li = document.createElement('li');
                li.innerHTML = elem.question;
                questionList.appendChild(li)
                if(elem.type == 'boolean') {
                    let answers = [elem.correct_answer, elem.incorrect_answers];
                    shuffle(answers)
                    answers.forEach(ans =>{
        let option = document.createElement('input');     
        option.setAttribute('type','radio')
        option.setAttribute('id', ans) 
        option.setAttribute('name', elem.question)
        let label = document.createElement('label');
        
        label.innerHTML = ans;
        let cont = document.createElement('div')
        cont.classList.add('ans-option')
        cont.appendChild(option)
        cont.appendChild(label)
        cont.style.flexDirection = 'row'
        questionList.appendChild(cont);
        
        
                    })
                }else{
         let answers = [elem.correct_answer, ...elem.incorrect_answers]
         shuffle(answers);
        
         answers.forEach(ans =>{
            let option = document.createElement('input');     
        option.setAttribute('type','radio')
        option.setAttribute('id', ans) 
        option.setAttribute('name', elem.question)
        let label = document.createElement('label');
        label.setAttribute('for', ans)
        label.innerHTML = ans;
        let cont = document.createElement('div')
        cont.classList.add('ans-option')
        cont.appendChild(option)
        cont.appendChild(label)
        questionList.appendChild(cont)
                    }) 
         
                }
            })
        }else if(request.readyState == 4) {
            console.log(request.status)
        }
            
        
    })
    if(category == "Any Category" && 
       difficulty == "Any Difficulty" && 
       type == "AnyType") {
        request.open('GET',`https://opentdb.com/api.php?amount=${nOfQ}`);
    } else if(
        category !== "Any Category" && 
       difficulty == "Any Difficulty" && 
       type == "AnyType"
    ) {
              request.open('GET',`https://opentdb.com/api.php?amount=${nOfQ}&category=${category}`) 
    } else if(
        category == "Any Category" && 
       difficulty !== "Any Difficulty" && 
       type == "AnyType"
    ) {
        request.open('GET',`https://opentdb.com/api.php?amount=${nOfQ}&difficulty=${difficulty}`)
    }else if(
        category == "Any Category" && 
       difficulty == "Any Difficulty" && 
       type !== "AnyType"
    ) {
        request.open('GET',`https://opentdb.com/api.php?amount=${nOfQ}&type=${type}`)
    }else if(
        category !== "Any Category" && 
       difficulty !== "Any Difficulty" && 
       type == "AnyType"
    ) {
        request.open('GET',`https://opentdb.com/api.php?amount=${nOfQ}&category=${category}&difficulty=${difficulty}`)
    }else if(
        category !== "Any Category" && 
       difficulty == "Any Difficulty" && 
       type !== "AnyType"
    ) {
        request.open('GET',`https://opentdb.com/api.php?amount=${nOfQ}&category=${category}&type=${type}`)
    }else if(
        category == "Any Category" && 
       difficulty !== "Any Difficulty" && 
       type !== "AnyType"
    ) {
        request.open('GET',`https://opentdb.com/api.php?amount=${nOfQ}&difficulty=${difficulty}&type=${type}`)
    }else{
        request.open('GET',`https://opentdb.com/api.php?amount=${nOfQ}&category=${category}difficulty=${difficulty}&type=${type}`)
    }
    request.send()
}
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}  
submitBtn.addEventListener('click', () =>{
questionList.style.display = "none"
result.forEach(elem =>{
    let correctAns = elem.correct_answer;
    let options = Array.from(document.querySelectorAll('input[type="radio"]'))
    for(let option of options){
    let index = options.indexOf(option)
    if(option.checked) {
        let checked = option.checked
    
        if(option.getAttribute('id') == correctAns) {
            score++
        }
        continue
        }
        
    }
    
})

    let AnswerUpdate = document.createElement('div');
AnswerUpdate.classList.add('answer-update')
AnswerUpdate.innerHTML = `You Scored:<br> ${score}`
document.querySelector('main').appendChild(AnswerUpdate);
submitBtn.remove() 
questions.style.display = 'none'
document.querySelector('main').appendChild(newQuiz) 
})
 
newQuiz.addEventListener('click', () =>{
    window.location.reload()
})
