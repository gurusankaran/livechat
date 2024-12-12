const socket = io()

const messageContainer = document.getElementById('message-container')
const replyMessage = document.getElementById('replyMessage')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  sendMessage()
})

socket.on('client-total',(data)=>{
  document.getElementById('client-total').innerText = 'Total Client:' + data
})

function sendMessage(){
  if(messageInput.value==='') return

  const data = {
    name:nameInput.value,
    message:messageInput.value,
    dateTime: new Date().toLocaleTimeString(),
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  replyMessage.innerText !== '' && (data.replyMessage = replyMessage.innerText);

  socket.emit('message',data)
  addMessageToUI(true,data)
  messageInput.value = ''
  replyClose()
}

socket.on('chat-message',(data)=>{
  // console.log(data);
  addMessageToUI(false,data)

})

function addMessageToUI(isOwnMessage, data){
  clearFeedBack()
 
  const element = `
<li ondblclick="replyButton('${data.id}')" id="${data.id}" onmouseout="option('${data.id}','out')" onmouseover="option('${data.id}','in')" class="${isOwnMessage ? "message-right" : "message-left"}">
    <span class="dropdown" onclick=revealOption('${data.id}') style="display:none;">
        <i class="fa fa-angle-down">
            <div class="dropup hidden hidden_${data.id}">
                <span onclick="replyButton('${data.id}')">Reply</span>
            </div>
        </i>
    </span>
    ${data.replyMessage !== undefined 
        ? `<p class="tagMessage ${isOwnMessage ? "right-tag" : "left-tag"}">${data.replyMessage}</p>` 
        : ''}
    <p class="message" data-message-id="${data.id}">
        ${data.message}
        <span>${data.name} ● ${data.dateTime}</span>
    </p>
</li>
`


  messageContainer.innerHTML+=element
  scrollToBottom()
}

function scrollToBottom(){
  messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
  socket.emit('feedback',{
    feedback:`${nameInput.value} is typing`
  })
  scrollToBottom()
})
messageInput.addEventListener('keypress',(e)=>{
  socket.emit('feedback',{
    feedback:`${nameInput.value} is typing`
  })
  scrollToBottom()
})
messageInput.addEventListener('blur',(e)=>{
  socket.emit('feedback',{
    feedback:''
  })
  scrollToBottom()
})

socket.on('feedback',(data)=>{
  clearFeedBack()
  document.getElementById('feedback').innerText = data.feedback
})

function clearFeedBack(){
  document.querySelectorAll('li.message-feedback').forEach(element=>{
    element.parentNode.removeChild(element)
  })
}