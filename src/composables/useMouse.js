import { reactive, onMounted, onUnmounted } from 'vue'

const mouse = reactive({
  x: 0.5,
  y: 0.5,
  nx: 0,
  ny: 0,
  px: 0,
  py: 0,
})

let raf = 0
let listening = 0

function onMove(e) {
  mouse.x = e.clientX / window.innerWidth
  mouse.y = e.clientY / window.innerHeight
  mouse.nx = mouse.x * 2 - 1
  mouse.ny = mouse.y * 2 - 1
}

function tick() {
  mouse.px += (mouse.nx - mouse.px) * 0.08
  mouse.py += (mouse.ny - mouse.py) * 0.08
  document.documentElement.style.setProperty('--mx', mouse.x.toFixed(4))
  document.documentElement.style.setProperty('--my', mouse.y.toFixed(4))
  document.documentElement.style.setProperty('--mnx', mouse.px.toFixed(4))
  document.documentElement.style.setProperty('--mny', mouse.py.toFixed(4))
  raf = requestAnimationFrame(tick)
}

export function useMouse() {
  onMounted(() => {
    listening += 1
    if (listening === 1) {
      window.addEventListener('pointermove', onMove, { passive: true })
      raf = requestAnimationFrame(tick)
    }
  })

  onUnmounted(() => {
    listening = Math.max(0, listening - 1)
    if (listening === 0) {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  })

  return mouse
}
