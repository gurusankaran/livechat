function option(id,action){
    const element = document.getElementById(id)
    action == "in" ? element.querySelector('span.dropdown').style.display = 'block' : 
    element.querySelector('span.dropdown').style.display = 'none'
}

function revealOption(id){
    document.querySelector(`.hidden_${id}`).classList.toggle('hidden')
}

function replyButton(id){
    var element = document.querySelector(`.message[data-message-id="${id}"]`);
    const messageElement = element.innerHTML
    document.querySelector('.replyContainer').style.display = 'flex'
    document.querySelector('#replyMessage').innerHTML = messageElement
    document.getElementById('message-input').focus()

}

function replyClose(){
    document.querySelector('#replyMessage').innerHTML = null
    document.querySelector('.replyContainer').style.display = 'none'
}