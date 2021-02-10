'use strict'

let gElCanvas;
let gCtx;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

let gStartPos


function onInit() {
    gElCanvas = document.getElementById('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()

    renderGallery()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    // window.addEventListener('resize', () => {
    //     resizeCanvas()
    //     renderCanvas()
    // })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)

    gElCanvas.addEventListener('mousedown', onDown)

    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)

    gElCanvas.addEventListener('touchstart', onDown)

    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!getClickedLine(pos, gElCanvas.width)) return
    setIsDragging(true)
    gStartPos = pos
    document.body.style.cursor = 'grab'
}

function onMove(ev) {
    console.log("isDragging", getMeme().isDragging)
    if (getMeme().isDragging) {
        document.body.style.cursor = 'grabbing'
        const pos = getEvPos(ev)
        const dx = pos.offsetX - gStartPos.offsetX
        const dy = pos.offsetY - gStartPos.offsetY

        setLinePos(dx, dy)

        gStartPos = pos
        renderCanvas()
        // renderCircle()
    }
}

function onUp() {
    document.body.style.cursor = 'unset'
    setIsDragging(false)
}

function getEvPos(ev) {
    var pos = {
        offsetX: ev.offsetX,
        offsetY: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            offsetX: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            offsetY: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
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
    renderMemeEditorScreen()
    renderCanvas()
}

function renderMemeEditorScreen() {
    document.querySelector('.grid-container').style.display = 'none'

    document.querySelector('.meme-container').style.display = 'flex'
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

    meme.lines.forEach((line, idx) => {

        if (idx === meme.selectedLineIdx && line.txt) {
            gCtx.textBaseline = 'top'
            const width = gCtx.measureText(line.txt).width
            gCtx.fillRect(10, line.pos.y, gElCanvas.width - 20, parseInt(line.size, 10));
        }

        console.log("Drawing text..")
        gCtx.lineWidth = 2
        gCtx.strokeStyle = line.color
        gCtx.fillStyle = 'white'
        gCtx.font = `${line.size}px IMPACT`
        gCtx.textAlign = line.align
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
    console.log(txt, "text")
    setMemeText(txt)
    renderCanvas()
    // drawText()
}

function onChangeFontSizeClicked(diff) {
    setFontSize(diff)
    renderCanvas()
}


function onNextLineClicked() {
    const meme = getMeme()
    if (!meme.lines.length > 1) return
    setNextLine()
    const memeText = document.getElementById('meme-text')
    memeText.value = meme.lines[meme.selectedLineIdx].txt
}

function resetText() {
    const memeText = document.getElementById('meme-text')
    memeText.value = ''
}

function onColorChanged(elColor) {
    const color = elColor.value
    if (!color) return
    setColor(color)
    renderCanvas()
}

function onAligmentClicked(alignmentCode) {
    setAlignment(alignmentCode)
    renderCanvas()
}


function onCanvasClicked(ev) {
    const { offsetX, offsetY } = ev
    const clickedLine = getClickedLine({ offsetX, offsetY }, gElCanvas.width)
    if (!clickedLine) return
    renderCanvas()

    const memeText = document.getElementById('meme-text')
    const meme = getMeme()
    memeText.value = meme.lines[meme.selectedLineIdx].txt
    document.getElementById('meme-text').focus()
}

function onDeleteLineClicked() {
    deleteLine()
    renderCanvas()
}

function onAddNewLine() {
    const meme = getMeme()
    const memeLength = meme.lines.length
    document.getElementById('meme-text').focus()
    if (meme.lines[memeLength - 1].txt === '') return //can't go to other lines before the previous one filled with text
    let pos
    if (!memeLength) pos = { x: 225, y: 50 }
    else if (memeLength === 1) pos = { x: 225, y: 450 }
    else pos = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
    console.log(pos, "pos")
    createLine(pos)
    resetText()
}

function onSaveClicked() {
    const imgData = getImgBase64()
    saveMeme(imgData)
}

function getImgBase64() {
    return gElCanvas.toDataURL('image/png')
}

function onSavedMemeClicked(ev) {
    ev.preventDefault()
    document.querySelector('.saved-meme-container').classList.remove('hide')
    document.querySelector('.grid-container').style.display = 'none'
    const imgs = getSavedMemes()
    if(!imgs) return

    const strHtml = imgs.map((img) => {
        return `
        <img src="${img}">
        `
    }).join('')

    document.querySelector('.saved-meme-container').innerHTML = strHtml
}