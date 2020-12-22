import React from 'react'
import { useEffect } from "react"
import { useConferenceStore } from "./ConferenceStore"
import { useConnectionStore } from "./ConnectionStore"
import { useLocalStore } from "./LocalStore"
import { throttle } from "lodash"

///LocalStore has dependency on ConferenceStore.
///This component provides the communication from ConferenceStore to LocalStore.
export const LocalStoreLogic = () => {

  const conference = useConferenceStore(state => state.conferenceObject)
  const calculateVolumes = useConferenceStore((store) => store.calculateVolumes)
  const { setMyID, setLocalTracks, pos,  id : myId } = useLocalStore()
  const jsMeet = useConnectionStore(store => store.jsMeet)
  // const pos = useLocalStore((store) => store.pos)
  
  useEffect(()=>{
    if(conference?.myUserId()) setMyID(conference.myUserId())
    
    //initialize the intial position of this user for other users
    if(conference)throttledSendPos(pos)
  },[conference])
  
  useEffect(() => {
      jsMeet
        ?.createLocalTracks({ devices: [ 'audio', 'video' ] }, true)
        .then(tracks => {setLocalTracks(tracks)})
        .catch(error => {
          console.log(error)
        });
  },[ jsMeet, setLocalTracks ])

  function sendPositionToPeers(pos) {
    conference?.sendCommand("pos", { value: pos })
  }

  const throttledSendPos = throttle(sendPositionToPeers, 200)

  useEffect(()=>{
    if(myId) {
      const newPos = JSON.stringify({...pos, id: myId})
      throttledSendPos(newPos)
      calculateVolumes(pos)
    }
  },[pos, myId])
  
  return <></>
}