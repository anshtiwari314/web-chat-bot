import React from 'react'
import {Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <>
    <div>Welcome to site</div>

    <Link to='/login'>
    <button >login</button>
    </Link>
    </>
  )
}
