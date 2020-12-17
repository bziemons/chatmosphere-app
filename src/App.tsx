import * as React from "react"
import "./App.css"
import JitsiConnection from "./components/JitsiConnection/JitsiConnection"
import { Footer } from "./components/Footer/Footer"
import { Header } from "./components/Header/Header"
import { Localuser } from "./components/Localuser/Localuser"
import { LocalStoreLogic } from "./Store/LocalStore"
import { Settings } from "./components/Settings/Settings"
import { Users } from "./components/User/Users"
import { Info } from "./components/common/Info/Info"
import { PropsList } from "react-zoom-pan-pinch/dist/store/interfaces/propsInterface"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { Room } from "./components/Room/Room"

const transformWrapperOptions: PropsList = {
  wheel: { step: 50 },
  scale: 1,
  defaultPositionX: 0,
  defaultPositionY: 0,
  positionX: 0,
  positionY: 0,
  options: {
    centerContent: false,
    limitToBounds: true,
    limitToWrapper: true,
    minScale: 0.2,
    // maxPositionX:10000, maxPositionY:10000,
    // minPositionX:0, minPositionY:0
  },
  // scalePadding:{animationTime:10},
  pan: { velocityEqualToMove: true },
  pinch: { disabled: true },
}

function App() {
  const timer = React.useRef<any>()
  const localHostPanChangeHandler = React.useRef<any>()
  const panChanged = (callback) => {
    localHostPanChangeHandler.current = callback
  }

  function onPanChange(params) {
    if (localHostPanChangeHandler.current){
      const viewport = {x:6000*params.scale,y:6000*params.scale}
      const panLimit = {x:viewport.x-window.innerWidth,y:viewport.y-window.innerHeight}
      localHostPanChangeHandler.current({
        ...params,
        positionX: Math.max(-panLimit.x,Math.min(0, params.positionX)),
        positionY: Math.max(-panLimit.y,Math.min(0, params.positionY)),
      })
    }
  }
  function onZoomChange(params) {
    console.log(params)
    // setPanPos({x:params.positionX,y:params.positionY})
  }

  return (
    <div className="App">
      <Info>
        Welcome to our Prototype
        <br />
        Please use <b>Safari</b> or <b>Chrome</b> for now for a stable
        Experience
      </Info>
      <Header>Chatmosphere</Header>
      <JitsiConnection />
      <LocalStoreLogic />
      <TransformWrapper
        {...transformWrapperOptions}
        onZoomChange={onPanChange}
        onPanning={onPanChange}
        onPinchingStop={onPanChange}
      >
        {/* https://github.com/prc5/react-zoom-pan-pinch#zoomin-prop-elements */}
        <TransformComponent>
          <Room>
            <Users />
            <Localuser panChanged={panChanged} />
          </Room>
        </TransformComponent>
        <Footer />
      </TransformWrapper>
    </div>
  )
}

export default App
