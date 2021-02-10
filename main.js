'use strict'

var gElCanvas;
var gCtx;

function onInit() {
    gElCanvas = document.getElementById('canvas')
    gCtx = gElCanvas.getContext('2d')

    renderGallery()
}

function renderGallery() {
    const imgs = getImgs()
    if (!imgs.length) return

    let strHtml = imgs.map((img) => {
        return `
        <img onclick="onImageClicked(${img.id})" src="${img.url}">
        `
    }).join('')

    document.querySelector('.grid-container').innerHTML = strHtml
}

function onImageClicked(imgId) {
    setMemeImgId(imgId)
    renderCanvas()
}

function renderCanvas() {
    const meme = getMeme()
    const imgId = meme.selectedImgId
    const img = getImgById(imgId)
    if (!img) return

    const elImg = new Image()
    elImg.src = img.url
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

        drawText()
    }


}

function drawText() {
    const meme = getMeme()

    meme.lines.forEach((line) => {
        gCtx.lineWidth = 2
        gCtx.strokeStyle = 'black'
        gCtx.fillStyle = 'white'
        gCtx.font = `${line.size}px IMPACT`
        gCtx.textAlign = 'center'

        gCtx.fillText(line.txt, line.pos.x, line.pos.y)
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
    })


    // const line = meme.lines[meme.selectedLineIdx]
    // let text = line.txt
    // const fontSize = line.size
    // console.log(text)

    // gCtx.lineWidth = 2
    // gCtx.strokeStyle = 'black'
    // gCtx.fillStyle = 'white'
    // gCtx.font = `${fontSize}px IMPACT`
    // gCtx.textAlign = 'center'

    // gCtx.fillText(text, line.pos.x, line.pos.y)
    // gCtx.strokeText(text, line.pos.x, line.pos.y)


}

function onMemeTextChanged(elMemeText) {
    const txt = elMemeText.value
    console.log("Text", txt)
    if (!txt) return
    setMemeText(txt)
    renderCanvas()
    // drawText()
}

function onChangeFontSizeClicked(diff) {
    setFontSize(diff)
    renderCanvas()
}


function onNextLineClicked() {
    setNextLine()
    document.getElementById('meme-text').value = ''
}
