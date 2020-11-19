import Days from './days.js'
import Scene from './scene.js'
import individuals from './individuals/index.js'

/* Constants */
const {Dove, Hawk} = individuals
const days = new Days()
const scene = new Scene()

/* Init App */
scene.addIndividual(new Dove())
scene.addIndividual(new Hawk())

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
  scene.produceResult()
  // console.log(scene)
  window.updateComponents()
}

window.updateComponents = _ => {
  $days.forceUpdate()
  $individuals.forceUpdate()
  $selection.forceUpdate()
}
