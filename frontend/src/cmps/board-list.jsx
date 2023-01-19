import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom"
import { boardService } from "../services/board.service.local"
import { loadBoards } from "../store/board.actions"
import { MenuButton, Menu, MenuItem } from 'monday-ui-react-core'
import { Duplicate, Delete } from 'monday-ui-react-core/icons'

export function BoardList({ onDuplicateBoard, onRemoveBoard }) {
    const navigate = useNavigate()
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    useEffect(() => {
        loadBoards()
    }, [])
    console.log(boards);
    function onMenuClick(ev) {
        // console.log('ev:', ev)
        // console.log('Menu Click');
        ev.preventDefault()
        ev.stopPropagation()
    }

    function onBoardClick(ev, boardId) {
        ev.preventDefault()
        ev.stopPropagation()
        navigate(`/board/${boardId}`)
    }

    if (!boards) return <div>Loading...</div>
    return <section className='board-list'>
        {boards.map(board => <NavLink to={`/board/${board._id}`} key={board._id} className="board-list-a flex">
            {board.title}
            <MenuButton className="board-list-menu-btn"
            // onClick={ev => onMenuClick(ev)}
            >
                <Menu
                    id="menu"
                    size="medium"
                // onClick={ev => onMenuClick(ev)}
                >
                    <MenuItem
                        onClick={(ev) => {
                            onMenuClick(ev)
                            onDuplicateBoard(board)
                        }}
                        icon={Duplicate}
                        title="Duplicate Board"
                    />
                    <MenuItem
                        onClick={(ev) => {
                            onMenuClick(ev)
                            onRemoveBoard(board._id)
                        }}
                        icon={Delete}
                        title="Delete"
                    />
                </Menu>
            </MenuButton>
            {/* <div onClick={ev => onMenuClick(ev)} >X</div> */}
        </NavLink>)}

    </section>

}