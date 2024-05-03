import { useItemsContext } from '@/context/ItemsContext'
import React, { useEffect } from 'react'

const time = 2000
const Fusing = ({loading}: {loading: boolean}) => {
    const [show , setShow] = React.useState(false)
    const {items} = useItemsContext()

    useEffect(() => {

        setShow(true)
        const timer = setTimeout(() => {
            setShow(false)
        }, time)
        return () => clearTimeout(timer)
    }
    , [items])

//modal que se muestra cuando se está fusionando

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <div className={`bg-white p-4 rounded-lg shadow-lg ${show ? 'block' : 'hidden'}`}>
        <h2 className="text-xl font-bold">Fusionando</h2>
        {loading ? <p className="text-sm">Espere un momento...</p> : <p className="text-sm">Fusión exitosa</p>}
      </div>
    </div>
  )
}

export default Fusing