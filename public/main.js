const socket = io()

const messageContainer = document.getElementById('message-container')
const replyMessage = document.getElementById('replyMessage')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const fileInput = document.getElementById('fileInput')


messageForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  sendMessage()
})

socket.on('client-total',(data)=>{
  document.getElementById('client-total').innerText = 'Total Client:' + data
})

function sendMessage() {
  if (messageInput.value === '' && fileInput.files.length === 0) return;

  let contentPromise;

  if (messageInput.value) {
    contentPromise = Promise.resolve(messageInput.value);
  } else {
    const file = fileInput.files[0];
    if(!['image/jpeg', 'image/png', 'image/jpg'].includes(fileInput.files[0].type)) return
    contentPromise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  contentPromise.then((content) => {
    const data = {
      name: nameInput.value,
      message: content,
      isFile: fileInput.files.length > 0,
      fileName: fileInput.files[0]?.name,
      dateTime: new Date().toLocaleTimeString(),
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
    };

    if (replyMessage.innerText !== '') {
      data.replyMessage = replyMessage.innerHTML;
      data.referId = referId      
    }

    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
    fileInput.value = '';
    replyClose();
  }).catch((error) => {
    console.error('Error reading file:', error);
  });
}


socket.on('chat-message',(data)=>{
  // console.log(data);
  addMessageToUI(false,data)

})

function addMessageToUI(isOwnMessage, data) {
  clearFeedBack();

  const isFileMessage = data.isFile ? true : false;
  const fileElement = isFileMessage
    ? `<div style="width:250px;height:200px"><img class="message-image" src="${data.message}" alt="image" style="max-width: 200px; max-height: 200px;border-radius:10px"/><span class="message" data-message-id="${data.id}" hidden><i style="font-size: 15px;">img: </i>${data.fileName}</span></div>`
    : `<p class="message" data-message-id="${data.id}">${data.message}</p>`;

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
          ? `<p href="#${data.referId}" onclick="anchorTag('${data.id}','${data.referId}')" class="tagMessage ${isOwnMessage ? "right-tag" : "left-tag"}">${data.replyMessage}</p>` 
          : ''}
        ${fileElement} 
        <span><i>${data.name}<i/> ● ${data.dateTime}</span>
    </li>
  `;

  messageContainer.innerHTML += element;
  scrollToBottom();
}


function scrollToBottom(){
  messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
  socket.emit('feedback',{
    feedback:`${nameInput.value} is typing`
  })
})
// document.addEventListener('keypress',(e)=>{
//   if(e.key == 'Enter'){
//     return
//   }
//   e.preventDefault()
//   messageInput.value += e.key
//   messageInput.focus()
// })
messageInput.addEventListener('blur',(e)=>{
  socket.emit('feedback',{
    feedback:''
  })
})

socket.on('feedback',(data)=>{
  clearFeedBack()
  document.getElementById('feedback').innerText = data.feedback
})

socket.on('server-message',(data)=>{
  clearFeedBack()
  document.getElementById('client-total').innerText = data
})

function clearFeedBack(){
  document.querySelectorAll('li.message-feedback').forEach(element=>{
    element.parentNode.removeChild(element)
  })
}

function openfile() {
  document.getElementById('fileInput').click();
}

async function handleFileSelection(event){
  const file = event.target.files[0];
  sendMessage()
}