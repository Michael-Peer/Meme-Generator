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
    drawImg()
}

function drawImg() {
    const meme = getMeme()
    const imgId = meme.selectedImgId
    const img = getImgById(imgId)
    if (!img) return

    const elImg = new Image()
    elImg.src = img.url
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

        drawText(meme)
    }


}

function drawText() {
    let text = getMeme().lines[0].txt
    console.log(text)

    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.font = '40px IMPACT'
    gCtx.textAlign = 'center'
    gCtx.fillText(text, 225, 50)
    gCtx.strokeText(text, 225, 50)
}

function onMemeTextChanged(elMemeText) {
    const txt = elMemeText.value
    if (!txt) return
    setMemeText(txt)
    drawImg()
    drawText()
}