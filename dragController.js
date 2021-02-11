/**
 * 
 * 
 * DRAG & DROP
 * 
 * 
 * **/

function onDown(ev) {
    const pos = getEvPos(ev)
    console.log(pos)
    const clickedLine = getClickedLine(pos, gElCanvas.width)
    const clickedSticker = getStickerClicked(pos, gElCanvas.width)
    if (!clickedLine && !clickedSticker) return
    else if (clickedLine) setIsDragging(true)
    else setIsStickerDragging(true)
    gStartPos = pos
    document.body.style.cursor = 'grab'
}

//clear on click outside canvas
function onMemeContainerClicked(ev) {
    if (ev.target !== document.getElementById('canvas')) {
        // debugger
        cleanTextFocus()
    }
}

function onMove(ev) {
    if (getMeme().isDragging) {
        document.body.style.cursor = 'grabbing'
        const pos = getEvPos(ev)
        const dx = pos.offsetX - gStartPos.offsetX
        const dy = pos.offsetY - gStartPos.offsetY

        setLinePos(dx, dy)

        gStartPos = pos
        renderCanvas()

    } else if (getMeme().isStickerDragging) {
        document.body.style.cursor = 'grabbing'
        const pos = getEvPos(ev)
        const dx = pos.offsetX - gStartPos.offsetX
        const dy = pos.offsetY - gStartPos.offsetY

        setStickerPos(dx, dy)

        gStartPos = pos
        renderCanvas()
    }
}

function onUp() {
    const meme = getMeme()
    meme.isDragging ? setIsDragging(false) : setIsStickerDragging(false)
    document.body.style.cursor = 'unset'
}