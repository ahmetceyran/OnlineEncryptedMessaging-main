//socket programlama ile kullanıcıların bağlantısının kurulması
//Html kısmından bilgilerin çekilmesi
const socket = io('http://localhost:3000')
const Chat = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageinput = document.getElementById('message-input')

//spn şifrelemenin eklenmesi
//kullanıcı adının alınması
import spn from "./spn.js";

const name = prompt("Lütfen İsminizi Giriniz!")
const encryption = document.querySelector('input[name="customRadioInline"]:checked').value

appendMessage('Bağlanıldı.',2)
//socket'e yeni kullanıcı eklenmesi
socket.emit('new-user', name)

//Seçilen yönteme göre şifrelemenin yapılması
function hash(string,type) {
    if(type == "sha")
    return sha256(string)
    else if(type == "spn")
    return spn.encrypt(string)
    }

    //Server'a yeni kullanıcı geldiğinde diğer tarafa bilgi mesajının gitmesi
  socket.on('user-connected', name=> {
    appendMessage(name+ ' Bağlandı',2)
})

//Her iki tarafında aynı şifreleme yöntemini kullanması durumunda mesajın karşı tarafa çözümlenerek iletilmesi
socket.on('chat-message', data=> {
    let datas = JSON.parse(data.data)
    console.log("data");
    console.log(datas);
    if (document.querySelector('input[name="customRadioInline"]:checked').value == "spn" && datas.encrypt == "spn") {
        datas.content = spn.decrypt(datas.content)
    }
    appendMessage(data.name +": "+ datas.content , 1)
})

//Mesajın türüne göre karşı tarafa farklı şekillerde iletilmesi
function appendMessage(message,align){
    const mesElement = document.createElement('div')
    mesElement.classList.add("card")
    mesElement.classList.add("my-3")
    mesElement.classList.add("w-50")
    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body")
    cardBody.classList.add("p-2")
    cardBody.innerText = message
    mesElement.append(cardBody)
    const cardCont = document.createElement("div")
    cardCont.classList.add("d-flex")
    cardCont.classList.add("flex-row")
    cardCont.classList.add("w-100")
    var bg = "white";
    if(align == 1){
        align = "justify-content-start"
        bg = "bg-secondary"
    }
    else if(align == 2){
        align = "justify-content-center"
        bg = "bg-info"
    }
    else if(align == 3) {
        align = "justify-content-end"
        bg = "bg-warning"
    }
    else {
        align = "justify-content-start"
        bg = "bg-dark"
    }
    cardCont.classList.add(align)
    mesElement.classList.add(bg)
    mesElement.classList.add("text-white")
    cardCont.append(mesElement)
    Chat.append(cardCont)
    Chat.scrollTop = Chat.scrollHeight
}

//Gönderilen mesajın ve şifreleme yönteminin alınması.
messageForm.addEventListener('submit', e=>{
    e.preventDefault()
    const message = messageinput.value
    appendMessage('Sen: '+ message,3)
    let encryptType = document.querySelector('input[name="customRadioInline"]:checked').value
    let data = {
        content: hash(message,encryptType),
        encrypt: encryptType
    }
    socket.emit('send-chat-message', JSON.stringify(data))
    messageinput.value = ''
})

//Kullanıcının server'dan ayrılması
socket.on('user-disconnected', name=> {
    appendMessage(name+ ' Ayrıldı',2)
})