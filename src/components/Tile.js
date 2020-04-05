import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { markPostAsRead } from '../actions'

const StyledZone = styled.div`
    position: relative;

    .tile {
        border-radius: 8px;
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        font-weight: bold;
        height: 90px;
        width: 90px;
    }

    .tile.main {
        background: white;
        border: 1px solid black;
    }

    .tile.dropzone {
        border: 1px dotted black;
        display: none;
        position: absolute;
    }

    .tile.dropzone.top {
        top: -95px;
    }

    .tile.dropzone.right {
        top: 0;
        right: -95px;
    }

    .tile.dropzone.bottom {
        bottom: -95px;
    }

    .tile.dropzone.left {
        top: 0;
        left: -95px;
    }
`

class Tile extends Component {
    render() {
        return (
            <StyledZone>             
                <div className="tile main" draggable="true">
                    <span>A</span>
                </div>
                <div className="tile dropzone top"></div>
                <div className="tile dropzone right"></div>
                <div className="tile dropzone bottom"></div>
                <div className="tile dropzone left"></div>
            </StyledZone>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
})

export default connect(mapStateToProps)(Tile)
