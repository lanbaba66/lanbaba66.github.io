const DEFAULT_OPTIONS = {
  compact: false,
  reducedMotion: false,
  showLabels: true,
}

export function validateGraphData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('技能图谱数据必须是对象。')
  }

  const { categories, nodes, links } = data
  if (!categories || Object.keys(categories).length === 0) {
    throw new Error('技能图谱至少需要一个分类。')
  }
  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new Error('技能图谱至少需要一个节点。')
  }
  if (!Array.isArray(links)) {
    throw new Error('技能图谱连线必须是数组。')
  }

  Object.entries(categories).forEach(([categoryId, category]) => {
    if (!category.label || !category.color || !Array.isArray(category.center) || category.center.length !== 2) {
      throw new Error(`分类 ${categoryId} 缺少 label、color 或有效 center。`)
    }
  })

  const nodeById = new Map()
  nodes.forEach((node) => {
    if (!node.id || !node.name || !node.category) {
      throw new Error('每个技能节点都必须包含 id、name 和 category。')
    }
    if (nodeById.has(node.id)) {
      throw new Error(`技能节点 ID 重复：${node.id}`)
    }
    if (!categories[node.category]) {
      throw new Error(`技能节点 ${node.name} 使用了未知分类：${node.category}`)
    }
    if (!node.description || !Array.isArray(node.uses) || node.uses.length === 0 || !node.status) {
      throw new Error(`技能节点 ${node.name} 缺少详情字段。`)
    }
    nodeById.set(node.id, node)
  })

  links.forEach((link) => {
    if (!Array.isArray(link) || link.length !== 2) {
      throw new Error('每条关联关系必须是 [起点节点 ID, 终点节点 ID]。')
    }
    const [sourceId, targetId] = link
    if (!nodeById.has(sourceId) || !nodeById.has(targetId)) {
      throw new Error(`关联关系包含未知技能：${sourceId} → ${targetId}`)
    }
    if (sourceId === targetId) {
      throw new Error(`关联关系不能连接技能自身：${sourceId}`)
    }
  })

  return nodeById
}

export function selectPreviewGraph(data) {
  validateGraphData(data)
  const nodes = data.nodes.filter((node) => node.preview)
  const ids = new Set(nodes.map((node) => node.id))
  const links = data.links.filter(([sourceId, targetId]) => ids.has(sourceId) && ids.has(targetId))

  return {
    categories: data.categories,
    nodes,
    links,
  }
}

export function calculateZoomCamera(camera, point, factor, minScale = 1, maxScale = 2.4) {
  const scale = Math.min(Math.max(camera.scale * factor, minScale), maxScale)
  const worldX = (point.x - camera.offsetX) / camera.scale
  const worldY = (point.y - camera.offsetY) / camera.scale

  return {
    scale,
    offsetX: point.x - worldX * scale,
    offsetY: point.y - worldY * scale,
  }
}

function createRandom(seed = 20260718) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

export function createSkillGraph(canvas, data, providedOptions = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('技能图谱需要有效的 Canvas 元素。')
  }

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('当前浏览器不支持 Canvas 2D 渲染。')
  }

  const definitionById = validateGraphData(data)
  const options = { ...DEFAULT_OPTIONS, ...providedOptions }
  const random = createRandom()
  const coreIds = new Set(['数学', 'Python', '数据分析', 'AI', '算法', '可视化'])
  const nodes = data.nodes.map((definition, index) => ({
    ...definition,
    index,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    fx: 0,
    fy: 0,
    degree: 0,
    phase: random() * Math.PI * 2,
    labelSide: random() > 0.5 ? 1 : -1,
  }))
  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const links = data.links.map(([sourceId, targetId]) => {
    const source = nodeById.get(sourceId)
    const target = nodeById.get(targetId)
    source.degree += 1
    target.degree += 1
    return {
      source,
      target,
      sameCategory: source.category === target.category,
      phase: random() * Math.PI * 2,
    }
  })
  const neighbors = new Map(nodes.map((node) => [node.id, new Set()]))
  links.forEach(({ source, target }) => {
    neighbors.get(source.id).add(target.id)
    neighbors.get(target.id).add(source.id)
  })

  let width = 0
  let height = 0
  let pixelRatio = 1
  let initialized = false
  let destroyed = false
  let requestId = null
  let lastFrame = performance.now()
  let elapsed = 0
  let activeCategory = null
  let camera = { scale: 1, offsetX: 0, offsetY: 0 }
  const pauseReasons = new Set()

  const metrics = () => ({
    centerX: width * 0.5,
    centerY: height * 0.5,
    spreadX: Math.min(width * (options.compact ? 0.25 : 0.35), options.compact ? 130 : 610),
    spreadY: Math.min(height * (options.compact ? 0.23 : 0.34), options.compact ? 82 : 380),
    margin: options.compact ? 18 : 44,
  })

  const positionNodes = () => {
    const graphMetrics = metrics()
    const categoryNodes = new Map(Object.keys(data.categories).map((id) => [id, []]))
    nodes.forEach((node) => categoryNodes.get(node.category).push(node))

    categoryNodes.forEach((groupNodes, categoryId) => {
      const categoryCenter = data.categories[categoryId].center
      groupNodes.forEach((node, index) => {
        const angle = (index / Math.max(groupNodes.length, 1)) * Math.PI * 2 + node.phase
        const ring = (options.compact ? 16 : 38) + (index % 3) * (options.compact ? 9 : 26)
        node.x = graphMetrics.centerX + categoryCenter[0] * graphMetrics.spreadX * 1.65 + Math.cos(angle) * ring
        node.y = graphMetrics.centerY + categoryCenter[1] * graphMetrics.spreadY * 1.75 + Math.sin(angle) * ring
        node.vx = 0
        node.vy = 0
      })
    })
  }

  const addForce = (node, x, y) => {
    node.fx += x
    node.fy += y
  }

  const simulate = (delta, settling = false) => {
    const graphMetrics = metrics()
    const compactScale = options.compact ? 0.72 : 1
    const forceScale = settling ? 1.22 : 0.82

    nodes.forEach((node) => {
      node.fx = 0
      node.fy = 0
    })

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const first = nodes[i]
        const second = nodes[j]
        let dx = second.x - first.x
        let dy = second.y - first.y
        let squaredDistance = dx * dx + dy * dy
        if (squaredDistance < 1) {
          dx = (random() - 0.5) * 2
          dy = (random() - 0.5) * 2
          squaredDistance = dx * dx + dy * dy
        }
        if (squaredDistance > 93000 * compactScale) continue

        const distance = Math.sqrt(squaredDistance)
        const directionX = dx / distance
        const directionY = dy / distance
        const collisionDistance = (coreIds.has(first.id) || coreIds.has(second.id) ? 52 : 42) * compactScale
        let magnitude = (first.category === second.category ? 118 : 96) * compactScale / (squaredDistance + 160)
        if (distance < collisionDistance) {
          magnitude += (collisionDistance - distance) * 0.006
        }
        const forceX = directionX * magnitude * forceScale
        const forceY = directionY * magnitude * forceScale
        addForce(first, -forceX, -forceY)
        addForce(second, forceX, forceY)
      }
    }

    links.forEach((link) => {
      const dx = link.target.x - link.source.x
      const dy = link.target.y - link.source.y
      const distance = Math.max(Math.hypot(dx, dy), 1)
      const desired = (link.sameCategory ? 72 : 108) * compactScale
      const strength = link.sameCategory ? 0.00135 : 0.00082
      const magnitude = (distance - desired) * strength * forceScale
      const forceX = (dx / distance) * magnitude
      const forceY = (dy / distance) * magnitude
      addForce(link.source, forceX, forceY)
      addForce(link.target, -forceX, -forceY)
    })

    nodes.forEach((node) => {
      const categoryCenter = data.categories[node.category].center
      const targetX = graphMetrics.centerX + categoryCenter[0] * graphMetrics.spreadX * 1.65
      const targetY = graphMetrics.centerY + categoryCenter[1] * graphMetrics.spreadY * 1.75
      addForce(node, (targetX - node.x) * 0.00048 * forceScale, (targetY - node.y) * 0.00048 * forceScale)
      addForce(node, (graphMetrics.centerX - node.x) * 0.00008, (graphMetrics.centerY - node.y) * 0.00008)

      if (!settling && !options.reducedMotion) {
        addForce(node, Math.sin(elapsed * 0.00016 + node.phase) * 0.001, Math.cos(elapsed * 0.00013 + node.phase) * 0.001)
      }

      if (node.x < graphMetrics.margin) addForce(node, (graphMetrics.margin - node.x) * 0.002, 0)
      if (node.x > width - graphMetrics.margin) addForce(node, (width - graphMetrics.margin - node.x) * 0.002, 0)
      if (node.y < graphMetrics.margin) addForce(node, 0, (graphMetrics.margin - node.y) * 0.002)
      if (node.y > height - graphMetrics.margin) addForce(node, 0, (height - graphMetrics.margin - node.y) * 0.002)

      const damping = settling ? 0.82 : 0.955
      node.vx = (node.vx + node.fx * delta) * damping
      node.vy = (node.vy + node.fy * delta) * damping
      const maxSpeed = settling ? 2 : options.compact ? 0.16 : 0.27
      const speed = Math.hypot(node.vx, node.vy)
      if (speed > maxSpeed) {
        node.vx = (node.vx / speed) * maxSpeed
        node.vy = (node.vy / speed) * maxSpeed
      }
      node.x += node.vx * delta
      node.y += node.vy * delta
    })
  }

  const visualStateForNode = (node) => {
    if (!activeCategory) return { opacity: 1, emphasized: false }
    if (node.category === activeCategory) return { opacity: 1, emphasized: true }
    const related = Array.from(neighbors.get(node.id)).some((id) => nodeById.get(id).category === activeCategory)
    return { opacity: related ? 0.32 : 0.1, emphasized: false }
  }

  const draw = () => {
    context.clearRect(0, 0, width, height)
    const graphMetrics = metrics()
    const halo = context.createRadialGradient(graphMetrics.centerX, graphMetrics.centerY, 0, graphMetrics.centerX, graphMetrics.centerY, Math.max(width, height) * 0.55)
    halo.addColorStop(0, 'rgba(105, 176, 203, 0.10)')
    halo.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.fillStyle = halo
    context.fillRect(0, 0, width, height)

    context.save()
    context.translate(camera.offsetX, camera.offsetY)
    context.scale(camera.scale, camera.scale)
    context.save()
    context.lineCap = 'round'
    links.forEach((link) => {
      let opacity = link.sameCategory ? 0.28 : 0.15
      let lineWidth = options.compact ? 0.58 : 0.74
      if (activeCategory) {
        if (link.source.category === activeCategory && link.target.category === activeCategory) {
          opacity = 0.7
          lineWidth = 1.25
        } else if (link.source.category === activeCategory || link.target.category === activeCategory) {
          opacity = 0.26
        } else {
          opacity = 0.025
        }
      }
      context.beginPath()
      context.moveTo(link.source.x, link.source.y)
      context.lineTo(link.target.x, link.target.y)
      context.strokeStyle = `rgba(120, 145, 157, ${opacity})`
      context.lineWidth = lineWidth
      context.stroke()
    })
    context.restore()

    nodes.forEach((node) => {
      const state = visualStateForNode(node)
      const color = data.categories[node.category].color
      const rgb = hexToRgb(color)
      const core = coreIds.has(node.id)
      const radius = (options.compact ? (core ? 3.3 : 2.1) : (core ? 5 : 2.7)) * (state.emphasized ? 1.18 : 1)
      const glowRadius = radius * (core ? 3.8 : 3.2)
      const glow = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius)
      glow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${core ? 0.3 : 0.2})`)
      glow.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`)
      context.globalAlpha = state.opacity
      context.beginPath()
      context.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
      context.fillStyle = glow
      context.fill()
      context.beginPath()
      context.arc(node.x, node.y, radius, 0, Math.PI * 2)
      context.fillStyle = color
      context.fill()
    })
    context.globalAlpha = 1

    if (options.showLabels) {
      context.save()
      context.textBaseline = 'middle'
      nodes.forEach((node) => {
        const state = visualStateForNode(node)
        const core = coreIds.has(node.id)
        const side = core ? (node.x >= graphMetrics.centerX ? 1 : -1) : node.labelSide
        const fontSize = options.compact ? (core ? 9.5 : 8.2) : (core ? 12.5 : 10.5)
        context.font = `${core ? 600 : 430} ${fontSize}px Inter, "PingFang SC", "Microsoft YaHei", sans-serif`
        context.textAlign = side === 1 ? 'left' : 'right'
        context.fillStyle = `rgba(48, 65, 74, ${activeCategory ? (state.emphasized ? 0.95 : 0.13) : (core ? 0.86 : 0.58)})`
        context.fillText(node.name, node.x + side * (options.compact ? 6 : 9), node.y)
      })
      context.restore()
    }
    context.restore()
  }

  const schedule = () => {
    if (destroyed || requestId !== null || pauseReasons.size > 0 || options.reducedMotion) return
    lastFrame = performance.now()
    requestId = window.requestAnimationFrame(frame)
  }

  const frame = (time) => {
    requestId = null
    if (destroyed || pauseReasons.size > 0) return
    const frameDelta = Math.min(time - lastFrame, 25)
    lastFrame = time
    elapsed += frameDelta
    simulate(frameDelta / 16.667)
    draw()
    schedule()
  }

  const resize = () => {
    const bounds = canvas.getBoundingClientRect()
    const nextWidth = Math.max(Math.round(bounds.width), 1)
    const nextHeight = Math.max(Math.round(bounds.height), 1)
    const oldWidth = width
    const oldHeight = height
    const sizeChanged = nextWidth !== oldWidth || nextHeight !== oldHeight
    width = nextWidth
    height = nextHeight
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * pixelRatio)
    canvas.height = Math.round(height * pixelRatio)
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    if (sizeChanged) camera = { scale: 1, offsetX: 0, offsetY: 0 }

    if (!initialized || oldWidth <= 1 || oldHeight <= 1) {
      positionNodes()
      for (let index = 0; index < (options.compact ? 160 : 320); index += 1) simulate(1, true)
      initialized = true
    } else {
      nodes.forEach((node) => {
        node.x *= width / oldWidth
        node.y *= height / oldHeight
      })
    }
    draw()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  return {
    nodes,
    links,
    start() {
      pauseReasons.delete('initial')
      if (options.reducedMotion) {
        draw()
        return
      }
      schedule()
    },
    pause(reason = 'manual') {
      pauseReasons.add(reason)
      if (requestId !== null) {
        window.cancelAnimationFrame(requestId)
        requestId = null
      }
    },
    resume(reason = 'manual') {
      pauseReasons.delete(reason)
      schedule()
    },
    resize,
    draw,
    setActiveCategory(categoryId) {
      activeCategory = activeCategory === categoryId ? null : categoryId
      draw()
      return activeCategory
    },
    getActiveCategory() {
      return activeCategory
    },
    getNode(id) {
      return definitionById.get(id) || null
    },
    getRelatedNodeIds(id) {
      return Array.from(neighbors.get(id) || [])
    },
    zoomAt(clientX, clientY, factor) {
      const bounds = canvas.getBoundingClientRect()
      const point = {
        x: (clientX - bounds.left) * (width / Math.max(bounds.width, 1)),
        y: (clientY - bounds.top) * (height / Math.max(bounds.height, 1)),
      }
      camera = calculateZoomCamera(camera, point, factor)
      draw()
      return camera.scale
    },
    findNodeAt(clientX, clientY) {
      const bounds = canvas.getBoundingClientRect()
      const screenX = (clientX - bounds.left) * (width / Math.max(bounds.width, 1))
      const screenY = (clientY - bounds.top) * (height / Math.max(bounds.height, 1))
      const x = (screenX - camera.offsetX) / camera.scale
      const y = (screenY - camera.offsetY) / camera.scale
      return nodes
        .map((node) => ({ node, distance: Math.hypot(node.x - x, node.y - y) }))
        .filter(({ distance }) => distance <= (options.compact ? 13 : 17))
        .sort((first, second) => first.distance - second.distance)[0]?.node || null
    },
    destroy() {
      destroyed = true
      resizeObserver.disconnect()
      if (requestId !== null) window.cancelAnimationFrame(requestId)
      requestId = null
      pauseReasons.clear()
    },
  }
}
