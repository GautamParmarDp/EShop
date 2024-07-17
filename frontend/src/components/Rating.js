import React from 'react'
import { Row } from 'react-bootstrap'

function Rating({value,text,color}) {
  return (
    <div className='rating'>
        
      <span>
        <i style={{color}} className={
            value >= 1
            ? 'fas fa-star'
            : value >= 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
        }>
        </i>
      </span>

      {/* 'fas fa-star' => Full filled star
      'fas fa-star-half-alt' => Half filled star
      'far fa-star' => Empty star */}

      <span>
        <i style={{color}} className={
            value >= 2
            ? 'fas fa-star'
            : value >= 1.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
        }>

        </i>
      </span>
      <span>
        <i style={{color}} className={
            value >= 3
            ? 'fas fa-star'
            : value >= 2.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
        }>

        </i>
      </span>
      <span>
        <i style={{color}} className={
            value >= 4
            ? 'fas fa-star'
            : value >= 3.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
        }>

        </i>
      </span>
      <span>
        <i style={{color}} className={
            value >= 5
            ? 'fas fa-star'
            : value >= 4.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
        }>

        </i>
      </span>
      
      <Row>
      <span>{text && text}</span> 
      </Row>
      {/* if text exist then put it here */}

    </div>
  )
}

export default Rating
