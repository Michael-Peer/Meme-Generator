'use strict'

const KEY = 'savedMemes';


let gKeywords = { 'happy': 12, 'angry': 1, 'funny': 15 }
let gImgs = [{ id: 1, url: './img/1.jpg', keywords: ['happy'] }, { id: 2, url: './img/2.jpg', keywords: ['happy'] },
{ id: 3, url: './img/3.jpg', keywords: ['angry'] }, { id: 4, url: './img/4.jpg', keywords: ['angry'] },
{ id: 5, url: './img/5.jpg', keywords: ['angry', 'funny'] }, { id: 6, url: './img/6.jpg', keywords: ['angry'] },
{ id: 7, url: './img/7.jpg', keywords: ['angry'] }, { id: 8, url: './img/8.jpg', keywords: ['angry'] },
{ id: 9, url: './img/9.jpg', keywords: ['angry', 'funny'] }, { id: 10, url: './img/10.jpg', keywords: ['angry'] },
{ id: 11, url: './img/11.jpg', keywords: ['angry'] }, { id: 12, url: './img/12.jpg', keywords: ['funny'] },
{ id: 13, url: './img/13.jpg', keywords: ['happy'] }, { id: 14, url: './img/14.jpg', keywords: ['happy'] },
{ id: 15, url: './img/15.jpg', keywords: ['happy'] }, { id: 16, url: './img/16.jpg', keywords: ['happy'] },
{ id: 17, url: './img/17.jpg', keywords: ['happy'] }, { id: 18, url: './img/18.jpg', keywords: ['happy'] },
];

let gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    isDragging: false,
    isStickerDragging: false,
    stickers: [],
    selectedStickerIdx: 0,
    lines: [
        // {
        //     txt: '',
        //     size: 30,
        //     align: 'center',
        //     color: 'black',
        //     pos: { x: 225, y: 50 },
        //     font: 'IMPACT'
        // },
    ]
}


function getKeywords() {
    return gKeywords
}


function getKeywordsAsArray() {
    const keywords = []
    for (const keyword in gKeywords) {
        keywords.push(keyword)
    }
    return keywords
}


function increaseKeywordCount(keyword) {
    gKeywords[keyword]++
}


function setIsDragging(isDragging) {
    gMeme.isDragging = isDragging
}


function setIsStickerDragging(isDragging) {
    gMeme.isStickerDragging = isDragging
}


function setSitcker(sticker) {
    gMeme.stickers.push(sticker)
}


function setStickerIdx(num) {
    gMeme.selectedStickerIdx = num - 1
}


function setLinePos(dx, dy) {

    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}


function setStickerPos(dx, dy) {
    gMeme.stickers[gMeme.selectedStickerIdx].pos.x += dx
    gMeme.stickers[gMeme.selectedStickerIdx].pos.y += dy
}


function createLine(pos) {
    const line = {
        txt: '',
        size: 30,
        color: 'black',
        font: 'IMPACT',
        align: 'center',
        pos
    }
    console.log(line, "lone")
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}


function deleteLine() {
    const lineIdx = gMeme.selectedLineIdx
    gMeme.lines.splice(lineIdx, 1)
    console.log(gMeme.selectedLineIdx)
    if (gMeme.selectedLineIdx) gMeme.selectedLineIdx -= 1

    console.log(gMeme.lines, gMeme.selectedLineIdx)

    if (!gMeme.lines.length) { //reset if empty list - conside use create line func
        const line = {
            txt: '',
            size: 30,
            color: 'black',
            font: 'IMPACT',
            pos: { x: 225, y: 50 }
        }
        gMeme.lines.push(line)
        // gMeme.selectedLineIdx +=1
    }

    console.log(gMeme.lines, "lines ")
}


function setUploadAsCurrImg(imgSrc) {
    console.log(gImgs)

    gImgs.push({
        id: gImgs.length + 1,
        url: imgSrc,
        keywords: ['my images']
    })
    console.log(gImgs)

    gMeme.selectedImgId = gImgs.length
}


function getClickedLine(clickedPos, canvasWidth) {
    // console.log(clickedPos,canvasWidth)
    // console.log("clickedPos - clickedPos", clickedPos)
    let lineIdx
    if (!gMeme.lines[gMeme.selectedLineIdx].txt) return // no text
    const clickedLine = gMeme.lines.find((line, idx) => {
        lineIdx = idx
        return clickedPos.offsetX > 10
            && clickedPos.offsetX < 10 + canvasWidth - 20
            && clickedPos.offsetY > line.pos.y
            && clickedPos.offsetY < line.pos.y + line.size
    })

    if (clickedLine) {
        gMeme.selectedLineIdx = lineIdx
    }

    console.log(clickedLine, "clicked line")

    return clickedLine
}


function initMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        selectedStickerIdx: 0,
        isDragging: false,
        isStickerDragging: false,
        stickers: [],
        lines: [
        ]
    }
}


function getStickerClicked(clickedPos, canvasWidth) {
    let stickerIdx
    const clickedSticker = gMeme.stickers.find((sticker, idx) => {
        stickerIdx = idx
        return clickedPos.offsetX > sticker.pos.x
            && clickedPos.offsetX < sticker.pos.x + 150
            && clickedPos.offsetY > sticker.pos.y
            && clickedPos.offsetY < sticker.pos.y + 150
    })

    if (clickedSticker) {
        gMeme.selectedStickerIdx = stickerIdx
    }

    return clickedSticker
}


function setNextLine() {
    const selectedLine = gMeme.selectedLineIdx === gMeme.lines.length - 1 ? 0 : gMeme.selectedLineIdx + 1
    console.log(selectedLine, "selectedLine")
    gMeme.selectedLineIdx = selectedLine
    renderCanvas()
}


function setMemeImgId(imgId) {
    gMeme.selectedImgId = imgId
}


function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}


function setFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font.toUpperCase()
}


function getMeme() {
    return gMeme
}


function getImgs() {
    return gImgs
}


function setMemeText(txt) {
    console.log(gMeme.lines, gMeme.selectedLineIdx)
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}


function getImgById(imgId) {
    const img = gImgs.find((img) => {
        return imgId === img.id
    })
    return img
}


function setFontSize(diff) {
    console.log(gMeme.selectedLineIdx, "setFontSize")
    let fontSize = gMeme.lines[gMeme.selectedLineIdx].size
    if ((fontSize === 8 && diff < 0) || (fontSize === 50 && diff > 0)) return
    gMeme.lines[gMeme.selectedLineIdx].size = fontSize + diff
}


function setAlignment(alignmentCode) {
    gMeme.lines[gMeme.selectedLineIdx].align = alignmentCode
}


function saveMeme(imgData) {
    const memes = loadFromStorage(KEY) || []
    memes.push(imgData)
    _saveMemeToStorage(memes)
}


function getSavedMemes() {
    return loadFromStorage(KEY)
}


function _saveMemeToStorage(memes) {
    saveToStorage(KEY, memes)
}
