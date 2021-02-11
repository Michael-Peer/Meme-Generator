
function getEvPos(ev) {
    var pos = {
        offsetX: ev.offsetX,
        offsetY: ev.offsetY
    }

    console.log(pos,)

    if (gTouchEvs.includes(ev.type)) {
        console.log("inside touch")
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            offsetX: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            offsetY: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function getImgBase64() {
    return gElCanvas.toDataURL('image/jpeg')
}