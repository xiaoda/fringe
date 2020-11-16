import Days from './days.js'
import Scene from './scene.js'
import individuals from './individuals/index.js'

/* Constants */
const {Dove, Hawk} = individuals
const days = new Days()
const scene = new Scene()

/* Functions */
window.updateComponents = _ => {
  $days.forceUpdate()
  $individuals.forceUpdate()
  $allocation.forceUpdate()
}

/* Init App */
scene.addIndividual(new Dove())
console.log(scene)

/* Init Components */
$days.setData({days})
$individuals.setData({scene})
$allocation.setData({scene})
