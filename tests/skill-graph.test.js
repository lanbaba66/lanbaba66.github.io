import assert from 'node:assert/strict'
import test from 'node:test'

import { skillGraphData } from '../js/skill-graph/data.js'
import { calculateZoomCamera, selectPreviewGraph, validateGraphData } from '../js/skill-graph/core.js'

test('完整图谱数据包含预期分类、节点和连线', () => {
  const nodeById = validateGraphData(skillGraphData)

  assert.equal(Object.keys(skillGraphData.categories).length, 5)
  assert.equal(skillGraphData.nodes.length, 73)
  assert.equal(skillGraphData.links.length, 125)
  assert.equal(nodeById.size, 73)
})

test('About 预览从共享数据筛选 14 个节点', () => {
  const preview = selectPreviewGraph(skillGraphData)
  const completeNodes = new Map(skillGraphData.nodes.map((node) => [node.id, node]))

  assert.equal(preview.nodes.length, 13)
  assert.equal(preview.links.length, 18)
  preview.nodes.forEach((node) => {
    assert.equal(node, completeNodes.get(node.id))
    assert.equal(node.preview, true)
  })
})

test('About 预览中的每条连线都引用预览节点', () => {
  const preview = selectPreviewGraph(skillGraphData)
  const previewIds = new Set(preview.nodes.map((node) => node.id))

  preview.links.forEach(([sourceId, targetId]) => {
    assert.equal(previewIds.has(sourceId), true)
    assert.equal(previewIds.has(targetId), true)
  })
})

test('数据校验拒绝重复节点和未知连线端点', () => {
  const duplicateNodeData = structuredClone(skillGraphData)
  duplicateNodeData.nodes.push(structuredClone(duplicateNodeData.nodes[0]))
  assert.throws(() => validateGraphData(duplicateNodeData), /技能节点 ID 重复/)

  const invalidLinkData = structuredClone(skillGraphData)
  invalidLinkData.links.push(['Python', '不存在的技能'])
  assert.throws(() => validateGraphData(invalidLinkData), /关联关系包含未知技能/)
})

test('指针定点缩放保持鼠标所指向的图谱坐标不变', () => {
  const camera = { scale: 1, offsetX: 0, offsetY: 0 }
  const point = { x: 320, y: 180 }
  const zoomed = calculateZoomCamera(camera, point, 1.5)

  assert.equal(zoomed.scale, 1.5)
  assert.equal((point.x - zoomed.offsetX) / zoomed.scale, 320)
  assert.equal((point.y - zoomed.offsetY) / zoomed.scale, 180)
})

test('图谱缩放比例被限制在 100% 到 240%', () => {
  const camera = { scale: 1, offsetX: 0, offsetY: 0 }
  const point = { x: 200, y: 120 }
  const maximum = calculateZoomCamera(camera, point, 100)
  const minimum = calculateZoomCamera(maximum, point, 0.001)

  assert.equal(maximum.scale, 2.4)
  assert.equal(minimum.scale, 1)
})
