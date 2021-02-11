'use strict'

let gElCanvas;
let gCtx;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

let gStartPos
let gShouldCleanFocus = false
let gIsFirstTimeLoadingCanvas


function onInit() {
    gElCanvas = document.getElementById('canvas')
    gCtx = gElCanvas.getContext('2d')
    gIsFirstTimeLoadingCanvas = true
    addListeners()
    renderGallery()
    renderKeywords()
}

/**
 * 
 * 
 * Listeners
 * 
 * 
 * **/

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    console.log("resizing")
    // Note: changing the canvas dimension this way clears the canvas
    console.log(elContainer.offsetWidth, elContainer.offsetHeight)
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
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


/**
 * 
 * 
 * Rendering
 * 
 * 
 * **/

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

function renderKeywords() {
    const keywords = getKeywords()
    console.log(keywords)
    if (!keywords) return

    let strHtml = ''

    for (const keyword in keywords) {
        const fontSize = keywords[keyword] + 14 + 'px'
        strHtml += `
        <div onclick="onKeywordClicked('${keyword}')" style="font-size: ${fontSize}; margin-right: 30px">${keyword}</div>
        `
    }

    document.querySelector('.keywords-conatiner').innerHTML = strHtml

}

function renderMemeEditorScreen() {
    document.querySelector('.grid-container').style.display = 'none'

    document.querySelector('.meme-container').style.display = 'flex'
}

function renderCanvas(donwloadImg) {

    //first time we need to resize the canvas to the correct screen
    if (gIsFirstTimeLoadingCanvas) {
        resizeCanvas()
        gIsFirstTimeLoadingCanvas = false
    }

    const meme = getMeme()
    const imgId = meme.selectedImgId
    const img = getImgById(imgId)
    if (!img) return

    const elImg = new Image()
    elImg.src = img.url
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

        if (meme.stickers.length) { //TODO: Loop and draw
            const elImg = new Image()
            elImg.src = meme.stickers[0]
            elImg.onload = () => {
                gCtx.drawImage(elImg, gElCanvas.width / 2, gElCanvas.height / 2, 150, 150)
                drawText()
            }
        } else {
            drawText(donwloadImg)
        }
    }
}

function drawText(donwloadImg) {
    const meme = getMeme()

    meme.lines.forEach((line, idx) => {

        console.log(gShouldCleanFocus)
        if (idx === meme.selectedLineIdx && line.txt && !gShouldCleanFocus) {
            gCtx.textBaseline = 'top'
            const width = gCtx.measureText(line.txt).width
            gCtx.beginPath();
            gCtx.rect(10, line.pos.y, gElCanvas.width - 20, parseInt(line.size, 10))
            gCtx.strokeStyle = 'white'
            gCtx.stroke();

        } else if (gShouldCleanFocus) gShouldCleanFocus = false


        console.log("Drawing text..")
        gCtx.lineWidth = 2
        gCtx.strokeStyle = line.color
        gCtx.fillStyle = 'white'
        gCtx.font = `${line.size}px IMPACT`
        gCtx.textAlign = line.align
        gCtx.fillText(line.txt, line.pos.x, line.pos.y)
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
        if (donwloadImg) donwloadImg()
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

/**
 * 
 * 
 * DRAG & DROP
 * 
 * 
 * **/

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
    }
}

function onUp() {
    document.body.style.cursor = 'unset'
    setIsDragging(false)
}

/**
 * 
 * 
 * Click Listeners
 * 
 * **/

function onImageClicked(imgId) {
    setMemeImgId(imgId)
    renderMemeEditorScreen()
    renderCanvas()
}

function onKeywordClicked(keyword) {
    increaseKeywordCount(keyword)
    renderKeywords()
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
    resetText()
    document.getElementById('meme-text').focus() // TODO: extract to function
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

function onSavedMemeClicked(ev) {
    ev.preventDefault()
    document.querySelector('.saved-meme-container').classList.remove('hide')
    document.querySelector('.grid-container').style.display = 'none'
    const imgs = getSavedMemes()
    if (!imgs) return

    const strHtml = imgs.map((img) => {
        return `
        <img src="${img}">
        `
    }).join('')

    document.querySelector('.saved-meme-container').innerHTML = strHtml
}

function onSearch(elSearch) {
    const searchTxt = elSearch.value
    const imgs = getImgs()
    const filteredImgs = imgs.filter((img) => {
        return img.keywords.every((keyword) => {
            return keyword.includes(searchTxt)
        })
    })


    //TODO: MOVE THIS TO THE CENTREAL RENDERING METHOD AND PASS ARRAY

    const strHtml = filteredImgs.map((img) => {
        return `
        <img onclick="onImageClicked(${img.id})" src="${img.url}">
        `
    }).join('')

    document.querySelector('.grid-container').innerHTML = strHtml


}

function onStickerClicked(imgNum) {
    const src = `./img/stickers/cat${imgNum}.png`
    setSitcker(src)
    renderCanvas()
}

function onDownloadClicked(elLink) {
    console.log(elLink)

    cleanTextFocus()
    const dataImg = getImgBase64()
    elLink.href = dataImg


    // cleanTextFocus(() => { // Holding elLink in a clousre till image done loading
    //     console.log(elLink)
    //     const dataImg = getImgBase64()
    //     elLink.href = dataImg
    //     console.log(elLink)
    //     gShouldCleanFocus = false
    // })
}



/**
 * 
 * 
 * Utils
 * 
 * **/

function getImgBase64() {
    return gElCanvas.toDataURL('image/jpeg')
}

function cleanTextFocus() {
    gShouldCleanFocus = true
    renderCanvas()
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


