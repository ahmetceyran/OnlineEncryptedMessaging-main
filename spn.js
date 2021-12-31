//Spn şifreleme için kullanılacak değişkenlerin tanımlanması
let key = string2Binary("security");
let sBox ="";
let ciText = "";

//Şifrelemede kullanılacak yer değiştirme fonksiyonu
function sub(data){
    let pData=""
    pData += data[2]; pData += data[8]; pData += data[12]; pData += data[5];
    pData += data[9]; pData += data[0]; pData += data[14]; pData += data[4];
    pData += data[11]; pData += data[1]; pData += data[15]; pData += data[6];
    pData += data[3]; pData += data[10]; pData += data[7]; pData += data[13];
    return pData
}

//Şifrelemede kullanılacak tekrar yer değiştirma fonksiyonu
function rSub(data){
    let rpData = "";
    rpData += data[5]; rpData += data[9];  rpData += data[0];  rpData += data[12];
    rpData += data[7]; rpData += data[3];  rpData += data[11]; rpData += data[14];
    rpData += data[1]; rpData += data[4];  rpData += data[13]; rpData += data[8];
    rpData += data[2]; rpData += data[15]; rpData += data[6]; rpData += data[10];
    return rpData;
}


//Xor'lama fonksiyonu ile açık metinle aynı uzunlukta kapalı metin oluşturma
function xor(string,subKey){
    let binXor= "";
    let xor = 0;
    for (let i = 0; i < string.length; i++) {
        xor = Number(string[i]) ^ Number(subKey[i]);
        binXor += String(xor);
    }
    return binXor;
}

//string metni binary'e çevirme fonksiyonu
function string2Binary(string) {
    return string.split('').map(function (char) {
        return char.charCodeAt(0).toString(2).padStart(8,0);
    }).join('');
}

//Binary'i string'e çevirme fonksiyonu
function binary2String(str) {
    var Binarr = []
    for(let i = 0; i<str.length;i+=8){
        Binarr.push(str.substring(i,i+8))
    }
    var binCode = [];
    for (let i = 0; i < Binarr.length; i++) {
        binCode.push(String.fromCharCode(parseInt(Binarr[i], 2)));
      }
    return binCode.join("");
}


//Şifreleme Fonksiyonu
const encrypt = function(text){
    text = text.length%2 == 1 ?text + " " : text;
    ciText = "";
    let bin_plainText = string2Binary(text)
    let data = bin_plainText
    let xor_text = "";

    for( let i = 0; i<bin_plainText.length; i+=16){
        data = bin_plainText.substring(i,i+16)
        for(let j = 0; j < 64; j+=16){
            xor_text = xor(data,key.substring(j,j+16))

            if (j<32) {
                sBox = sub(xor_text)
            }
            else{
                sBox = xor_text
            }
            data = sBox
        }
        ciText += data;
    }
    return ciText
}


//Şifre çözme fonksiyonu
const decrypt = function(text){
    let cipher_Text = text;
    let plain_Text = "";
    let xor_text = "";
    let data = "";

    for( let i = 0; i<cipher_Text.length; i+=16){
        data = cipher_Text.substring(i,i+16)
        for(let j = 48; j >= 0; j-=16){
            xor_text = xor(data,key.substring(j,j+16))

            if (j == 48 || j == 0) {
                sBox = xor_text
            }
            else{
                sBox = rSub(xor_text)
            }
            data = sBox
        }
        plain_Text += data;
    }
    return binary2String(plain_Text)
}

//Fonksiyonları dışa aktarma
export default {
    decrypt,
    encrypt,
    string2Binary,
    binary2String,
    sub,
    rSub,
    xor
}
