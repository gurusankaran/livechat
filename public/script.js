var referId;

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
    referId = id
}

function replyClose(){
    document.querySelector('#replyMessage').innerHTML = null
    document.querySelector('.replyContainer').style.display = 'none'
}

function anchorTag(id,referId){
    const element = document.getElementById(referId);

    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                console.log('red');
                element.style.boxShadow = '0 0 30px red';

                setTimeout(() => {
                    element.style.boxShadow = 'none';
                }, 3000);

                observer.disconnect();
            }
        },
        { threshold: 1.0 }
    );

    observer.observe(element);
}