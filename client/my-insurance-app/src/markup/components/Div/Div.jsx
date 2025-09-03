import React from 'react'
import ayat from '../../../assets/image/ayat.jpeg'
import amaga from '../../../assets/image/amaga.jpg'
import ICMC from '../../../assets/image/Cmc.jpg'
import arsho from '../../../assets/image/arsho.png'
import afri from '../../../assets/image/afri.png'
import gutema from '../../../assets/image/gutema.png'
import gifti from '../../../assets/image/gifti.svg'
import './dv.css'

const images = [ayat, amaga, ICMC, arsho, afri, gutema, gifti];

export default function Div() {
  return (
    <>
      <h1 className='trust'>Our Company is Trusted by</h1>
      <div className="baner-wrapper">
        <div className="baner">
          {[...images, ...images].map((img, index) => (
            <div key={index} className="ban">
              <img src={img} alt="" className='icmc'/>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
