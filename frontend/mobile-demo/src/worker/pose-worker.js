// pose-worker.js
// This Web Worker receives a message with { landmarks } and returns advice.
// It is lightweight and does not include heavy model code — it performs analysis on landmarks.

importScripts();

self.onmessage = function (e) {
  const { cmd, landmarks } = e.data
  if (cmd === 'analyze' && landmarks) {
    // simple analysis (porting logic from pose-analysis.js)
    const advice = []
    try {
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
    } catch (err) {
      // ignore
    }
    self.postMessage({ advice })
  }
}
