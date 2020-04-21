import React from 'react'

const Notification = ({ type, text }) => (
    <li className={type}>
        { text }
    </li>
)

export default Notification