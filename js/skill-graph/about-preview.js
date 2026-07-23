import { skillGraphData } from './data.js'
import { createSkillGraph, selectPreviewGraph } from './core.js'

const previewData = selectPreviewGraph(skillGraphData)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const initializePreview = (container) => {
  const canvas = container.querySelector('canvas')
  const fallback = container.querySelector('[data-graph-fallback]')
  let graph = null
  let intersectionObserver = null

  try {
    graph = createSkillGraph(canvas, previewData, {
      compact: true,
      reducedMotion: reduceMotion,
      showLabels: true,
    })
    container.classList.add('is-ready')
    fallback.hidden = true

    if (reduceMotion) {
      graph.start()
    } else if ('IntersectionObserver' in window) {
      graph.pause('viewport')
      intersectionObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          graph.resume('viewport')
        } else {
          graph.pause('viewport')
        }
      }, { threshold: 0.08 })
      intersectionObserver.observe(container)
    } else {
      graph.start()
    }
  } catch (error) {
    console.warn('About 技能图谱初始化失败：', error)
    container.classList.add('has-fallback')
    fallback.hidden = false
  }

  const handleVisibility = () => {
    if (!graph || reduceMotion) return
    if (document.hidden) {
      graph.pause('document')
    } else {
      graph.resume('document')
    }
  }

  const destroy = () => {
    document.removeEventListener('visibilitychange', handleVisibility)
    intersectionObserver?.disconnect()
    graph?.destroy()
  }

  document.addEventListener('visibilitychange', handleVisibility)
  handleVisibility()
  window.addEventListener('pagehide', destroy, { once: true })
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-skill-graph-preview]').forEach(initializePreview)
})
