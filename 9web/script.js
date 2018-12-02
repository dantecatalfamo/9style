window.windows = []

function removeFocus(e) {
  e.classList.remove('window-fg')
  e.classList.add('window-bg')
}

function addFocus(e) {
  e.classList.remove('window-bg')
  e.classList.add('window-fg')
}

function compareZ(a, b) {
  if (a.style.zIndex > b.style.zIndex)
    return 1
  if (a.style.zIndex < b.style.zIndex)
    return -1
  return 0
}

function raiseWindowZ(e) {
  e.style.zIndex = windows.length + 1
}

function focusWindow(e) {
  const f = e.srcElement
  if (document.querySelector('.window-fg') == f) {
    return
  }
  windows.forEach((w) => {
    if (w != f) {
      removeFocus(w)
    }
    addFocus(f)
    raiseWindowZ(f)
  })
  windows.sort(compareZ)
  windows.forEach((e, i) => {
    e.style.zIndex = i+1
  })
}

function dragWindow(win) {
  win.onmousedown = dragMouseDown

  function dragMouseDown(e) {
    e = e || window.event
    // Only move on border drag, if we're inside the box, do nothing
    if ( e.offsetX > 0 && e.offsetY > 0 && e.offsetX < e.srcElement.clientWidth && e.offsetY < e.srcElement.clientHeight )
      return

    e.preventDefault()

    initMouseX = e.clientX
    initMouseY = e.clientY
    document.onmouseup = closeDragWindow
    document.onmousemove = windowDrag
  }

  function windowDrag(e) {
    e = e || window.event
    e.preventDefault()

    DeltaX = initMouseX - e.clientX
    DeltaY = initMouseY - e.clientY
    initMouseX = e.clientX
    initMouseY = e.clientY

    win.style.left = (win.offsetLeft - DeltaX) + "px"
    win.style.top = (win.offsetTop - DeltaY) + "px"
  }

  function closeDragWindow() {
    document.onmouseup = null
    document.onmousemove = null
  }
}

function initializeWindows() {
  document.querySelectorAll('.window').forEach(win => {
    window.windows.push(win)
    win.addEventListener('mousedown', focusWindow)
    dragWindow(win)
  })
}
