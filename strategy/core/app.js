import Days from './days.js'
import Scene from './scene.js'
import SceneLogs from './scene-logs.js'
import individuals from './individuals/index.js'

/* Constants */
const {Dove, Hawk} = individuals
const days = new Days()
const scene = new Scene()
const sceneLogs = new SceneLogs()

/* Init App */
scene.addIndividuals([
  new Dove(), new Dove(),
  new Hawk(), new Hawk()
])
scene.useLogService(sceneLogs)
scene.saveLog()

/* Init Components */
$days.setData({days})
$individuals.setData({scene})
$selection.setData({scene})

/* Functions */
window.toNextDay = _ => {
  days.toNextDay()
  scene.resetDailyData()
  scene.selectFood()
  scene.allocateFood()
  scene.generateResult()
  scene.saveLog()
  console.info('Next Day', scene)
  window.updateComponents()
}

window.updateComponents = _ => {
  $days.forceUpdate()
  $individuals.forceUpdate()
  $selection.forceUpdate()
}
