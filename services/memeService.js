'use strict'

let gKeywords = { 'happy': 12, 'funny puk': 1 }
let gImgs = [{ id: 1, url: './img/1.jpg', keywords: ['happy'] }, { id: 2, url: './img/2.jpg', keywords: ['happy'] }];

let gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}

function setMemeImgId(imgId) {
    gMeme.selectedImgId = imgId
}

function getMeme() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function setMemeText(txt) {
    gMeme.lines[0].txt = txt
}

function getImgById(imgId) {
    const img = gImgs.find((img) => {
        return imgId === img.id
    })
    return img
}
