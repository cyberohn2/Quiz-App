let dataForm = document.getElementById('data-form');
let submitBtn = document.querySelector('#submit');
let nOfQ = document.querySelector('#numofQ');

dataForm.addEventListener('submit', (e) =>{
 let inputControl = nOfQ.parentElement; 
    if(nOfQ.value = ''){
    e.preventDefault()
        setError(inputControl, 'cannot be empty')
    }else{
        setSuccess(inputControl)
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
}

