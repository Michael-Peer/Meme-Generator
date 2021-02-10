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
            pos: { x: 225, y: 50 },
        },
        {
            txt: '',
            size: 30,
            align: 'left',
            color: 'red',
            pos: { x: 225, y: 450 }
        }
    ]
}



function getClickedText(clickedPos) {
    // console.log(clickedPos.offsetX, clickedPos.offsety)
    // gCtx.fillRect(10, line.pos.y, gElCanvas.width - 20, parseInt(line.size, 10));

    const clickedLine = gMeme.lines.find((line) => {
        return clickedPos.offsetX > 10 
        && clickedPos.offsetX < 10 + gElCanvas.width - 20
        && clickedPos.offsetY > line.pos.y
        && clickedPos.offsetY < line.pos.y + line.size
    })

    return clickedLine
}

function setNextLine() {
    const selectedLine = gMeme.selectedLineIdx === 1 ? 0 : 1
    gMeme.selectedLineIdx = selectedLine
}

function setMemeImgId(imgId) {
    gMeme.selectedImgId = imgId
}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
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
    let fontSize = gMeme.lines[gMeme.selectedLineIdx].size
    if (fontSize === 1) return
    gMeme.lines[selectedLineIdx].size = fontSize + diff
}

function setAlignment(alignmentCode) {
    gMeme.lines[gMeme.selectedLineIdx].align = alignmentCode
}
