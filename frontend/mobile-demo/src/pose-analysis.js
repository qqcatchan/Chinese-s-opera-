// pose-analysis.js
// Exports utility functions for pose analysis and drawing landmarks.

export function analyzePose(landmarks) {
  // Simple checks: torso tilt, head alignment, arm angles, knee bend
  const advice = []

  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]

  const shoulderMid = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const hipMid = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

  const dx = shoulderMid.x - hipMid.x
  const dy = shoulderMid.y - hipMid.y
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  const tilt = Math.abs(angle)
  if (tilt > 10) advice.push('Torso tilted — stand upright')

  const nose = landmarks[0]
  const headDy = nose.y - shoulderMid.y
  if (Math.abs(headDy) > 0.12) advice.push('Head position off — lift or align your head')

  function angleBetween(a, b, c) {
    const ab = { x: a.x - b.x, y: a.y - b.y }
    const cb = { x: c.x - b.x, y: c.y - b.y }
    const dot = ab.x * cb.x + ab.y * cb.y
    const mag = Math.sqrt((ab.x * ab.x + ab.y * ab.y) * (cb.x * cb.x + cb.y * cb.y))
    if (mag === 0) return 0
    const cos = Math.max(-1, Math.min(1, dot / mag))
    return Math.acos(cos) * (180 / Math.PI)
  }

  // Arms
  const leftElbow = landmarks[13]
  const leftWrist = landmarks[15]
  const leftArmAngle = angleBetween(leftShoulder, leftElbow, leftWrist)
  if (leftArmAngle < 30) advice.push('Left arm: consider bending elbow slightly')

  const rightElbow = landmarks[14]
  const rightWrist = landmarks[16]
  const rightArmAngle = angleBetween(rightShoulder, rightElbow, rightWrist)
  if (rightArmAngle < 30) advice.push('Right arm: consider bending elbow slightly')

  // Knees
  const leftKnee = landmarks[25]
  const leftAnkle = landmarks[27]
  const leftKneeAngle = angleBetween(leftHip, leftKnee, leftAnkle)
  if (leftKneeAngle < 150) advice.push('Left knee: straighten if appropriate')

  const rightKnee = landmarks[26]
  const rightAnkle = landmarks[28]
  const rightKneeAngle = angleBetween(rightHip, rightKnee, rightAnkle)
  if (rightKneeAngle < 150) advice.push('Right knee: straighten if appropriate')

  if (advice.length === 0) return ['Good posture — keep it up!']
  return advice
}

export function drawLandmarks(ctx, landmarks, width, height) {
  ctx.fillStyle = 'rgba(255,0,0,0.9)'
  for (let i = 0; i < landmarks.length; i++) {
    const x = landmarks[i].x * width
    const y = landmarks[i].y * height
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fill()
  }
  ctx.strokeStyle = 'rgba(0,255,0,0.8)'
  ctx.lineWidth = 2
  const drawLine = (a, b) => {
    ctx.beginPath()
    ctx.moveTo(landmarks[a].x * width, landmarks[a].y * height)
    ctx.lineTo(landmarks[b].x * width, landmarks[b].y * height)
    ctx.stroke()
  }
  // shoulders and hips
  drawLine(11, 12)
  drawLine(11, 23)
  drawLine(12, 24)
}
