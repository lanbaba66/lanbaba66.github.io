import { skillGraphData } from './data.js'
import { createSkillGraph } from './core.js'

window.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('[data-full-skill-graph]')
  if (!page) return

  const canvas = page.querySelector('canvas')
  const fallback = page.querySelector('[data-graph-fallback]')
  const legend = page.querySelector('[data-graph-legend]')
  const meta = page.querySelector('[data-graph-meta]')
  const liveStatus = page.querySelector('[data-graph-live-status]')
  const dialogLayer = page.querySelector('[data-graph-dialog-layer]')
  const dialog = page.querySelector('[data-graph-dialog]')
  const closeButton = page.querySelector('[data-graph-dialog-close]')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let graph = null
  let previouslyFocused = null

  canvas.setAttribute('aria-label', `由 ${skillGraphData.nodes.length} 个技能和 ${skillGraphData.links.length} 条关联组成的动态技能图谱；点击节点可查看详情，按住 Ctrl 并滚动鼠标滚轮可缩放图谱。`)

  const updateMeta = (paused = false) => {
    meta.textContent = `${skillGraphData.nodes.length} nodes · ${skillGraphData.links.length} links · ${paused ? 'simulation paused' : reduceMotion ? 'static view' : 'live simulation'}`
  }

  const closeDialog = () => {
    if (dialogLayer.hidden) return
    dialogLayer.hidden = true
    graph?.resume('dialog')
    updateMeta(false)
    liveStatus.textContent = '已关闭技能介绍，图谱运动已恢复。'
    previouslyFocused?.focus({ preventScroll: true })
  }

  const openDialog = (node, trigger = canvas) => {
    const definition = graph.getNode(node.id)
    const category = skillGraphData.categories[definition.category]
    const related = graph.getRelatedNodeIds(definition.id).slice(0, 6)
    previouslyFocused = trigger
    dialog.style.setProperty('--graph-focus-color', category.color)
    dialog.querySelector('[data-dialog-category]').textContent = category.label
    dialog.querySelector('[data-dialog-node]').textContent = definition.name
    dialog.querySelector('[data-dialog-title]').textContent = definition.name
    dialog.querySelector('[data-dialog-status]').textContent = `当前状态 · ${definition.status}`
    dialog.querySelector('[data-dialog-description]').textContent = definition.description
    dialog.querySelector('[data-dialog-uses]').replaceChildren(...definition.uses.map((value) => {
      const tag = document.createElement('span')
      tag.textContent = value
      return tag
    }))
    dialog.querySelector('[data-dialog-related]').replaceChildren(...related.map((value) => {
      const tag = document.createElement('span')
      tag.textContent = value
      return tag
    }))
    dialogLayer.hidden = false
    graph.pause('dialog')
    updateMeta(true)
    liveStatus.textContent = `已打开${definition.name}的技能介绍，图谱运动已暂停。`
    closeButton.focus()
  }

  const handleWheel = (event) => {
    if (!event.ctrlKey || !graph || !dialogLayer.hidden) return
    event.preventDefault()
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? canvas.clientHeight : 1)
    const scale = graph.zoomAt(event.clientX, event.clientY, Math.exp(-delta * 0.0015))
    liveStatus.textContent = `图谱缩放 ${Math.round(scale * 100)}%`
  }

  try {
    graph = createSkillGraph(canvas, skillGraphData, {
      compact: false,
      reducedMotion: reduceMotion,
      showLabels: true,
    })
    page.classList.add('is-ready')
    fallback.hidden = true
    graph.start()
    updateMeta(false)
    canvas.addEventListener('wheel', handleWheel, { passive: false })

    Object.entries(skillGraphData.categories).forEach(([categoryId, category]) => {
      const button = document.createElement('button')
      const count = skillGraphData.nodes.filter((node) => node.category === categoryId).length
      button.type = 'button'
      button.className = 'full-graph-legend-item'
      button.dataset.category = categoryId
      button.style.setProperty('--legend-color', category.color)
      button.setAttribute('aria-pressed', 'false')
      button.innerHTML = `<i aria-hidden="true"></i><span>${category.label}</span><small>${count}</small>`
      button.addEventListener('click', () => {
        const activeCategory = graph.setActiveCategory(categoryId)
        legend.querySelectorAll('button').forEach((item) => {
          item.setAttribute('aria-pressed', String(item.dataset.category === activeCategory))
        })
        liveStatus.textContent = activeCategory ? `已强调${category.label}分类。` : '已恢复完整技能图谱。'
      })
      legend.appendChild(button)
    })

    canvas.addEventListener('click', (event) => {
      const node = graph.findNodeAt(event.clientX, event.clientY)
      if (node) openDialog(node)
    })
  } catch (error) {
    console.warn('完整技能图谱初始化失败：', error)
    page.classList.add('has-fallback')
    fallback.hidden = false
    meta.textContent = '当前浏览器无法运行动态图谱'
  }

  closeButton.addEventListener('click', closeDialog)
  dialogLayer.addEventListener('click', closeDialog)
  dialog.addEventListener('click', (event) => event.stopPropagation())
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDialog()
  })
  const handleVisibility = () => {
    if (!graph || reduceMotion) return
    if (document.hidden) graph.pause('document')
    else graph.resume('document')
  }
  const destroy = () => {
    document.removeEventListener('visibilitychange', handleVisibility)
    canvas.removeEventListener('wheel', handleWheel)
    graph?.destroy()
  }
  document.addEventListener('visibilitychange', handleVisibility)
  handleVisibility()
  window.addEventListener('pagehide', destroy, { once: true })
})
