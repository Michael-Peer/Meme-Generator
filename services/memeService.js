'use strict'

let gKeywords = { 'happy': 12, 'funny puk': 1 }
let gImgs = [{ id: 1, url: './img/1.jpg', keywords: ['happy'] }, { id: 2, url: './img/2.jpg', keywords: ['happy'] }];

let gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: '',
            size: 30,
            align: 'left',
            color: 'red',
            pos : { x: 225, y: 50}
        },
        {
            txt: '',
            size: 30,
            align: 'left',
            color: 'red',
            pos : { x: 225, y: 450}
        }
    ]
}

function setNextLine() {
    const selectedLine = gMeme.selectedLineIdx === 1 ? 0 : 1
    gMeme.selectedLineIdx = selectedLine
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
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function getImgById(imgId) {
    const img = gImgs.find((img) => {
        return imgId === img.id
    })
    return img
}

function setFontSize(diff) {
    let fontSize = gMeme.lines[0].size
    if (fontSize === 1) return
    gMeme.lines[selectedLineIdx].size = fontSize + diff
}
