import { EditableHeading, Tooltip } from 'monday-ui-react-core'
import { useState } from 'react';
import { updateBoard, updateGroup } from '../store/board.actions';
import { TaskPreview } from "./task-preview";
import { MenuButton, Menu, MenuItem, ColorPicker } from 'monday-ui-react-core'
import { Delete, Bullet, Duplicate, Add } from 'monday-ui-react-core/icons'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service';
import { ADD_GROUP, ADD_GROUP_TASK, boardService, CHANGE_GROUP_COLOR, CHANGE_GROUP_TITLE, DELETE_GROUP, DUPLICATE_GROUP } from '../services/board.service.local';
import { utilService } from '../services/util.service';
import { AddLabelModal } from './tasks-modals/add-label-modal';

export function GroupList({ board, group }) {

    const [isAddingLabel, setIsAddingLabel] = useState(false)
    const [isPickColor, setIsPickColor] = useState(false)
    const [groupToUpdate, setGroupToUpdate] = useState(group)
    const [newTaskTitle, setNewTaskTitle] = useState('')

    function onFinishEditing() {
        updateGroup(board, groupToUpdate, CHANGE_GROUP_TITLE)
    }

    function handleChange(value) {
        setGroupToUpdate(prevGroup => ({ ...prevGroup, title: value }))
    }

    function onAddGroup(group) {
        updateGroup(board, group, ADD_GROUP)
    }

    function onDuplicateGroup(group) {
        updateGroup(board, group, DUPLICATE_GROUP)
    }

    function onDeleteGroup(group) {
        updateGroup(board, group, DELETE_GROUP)
    }

    function onSetColorGroup() {
        setIsPickColor(!isPickColor)
    }

    function onColorPick([color]) {
        color = utilService.getColorHex(color)
        setIsPickColor(!isPickColor)
        updateGroup(board, { group, color }, CHANGE_GROUP_COLOR)
    }

    function handleChangeTask(value) {
        setNewTaskTitle(value)
    }

    function onAddGroupTask() {
        if (!newTaskTitle) throw new Error('Task title is empty')
        updateGroup(board, { group, newTaskTitle }, ADD_GROUP_TASK)
        setNewTaskTitle('')
    }

    function toggleAddLabelModal() {
        setIsAddingLabel(!isAddingLabel)
    }

    return <section className='group-list'>
        <div className="group-header-container">
            <MenuButton className="group-list-menu-btn" >
                <Menu
                    id="menu"
                    size="medium"
                    style={{
                        backgroundColor: 'red',
                        color: 'red'
                    }}
                >
                    <MenuItem
                        onClick={() => onAddGroup(group)}
                        icon={Add}
                        title="Add Group"
                    />
                    <MenuItem
                        onClick={() => onSetColorGroup()}
                        icon={Bullet}
                        title="Change Color"
                    />
                    <MenuItem
                        onClick={() => onDuplicateGroup(group)}
                        icon={Duplicate}
                        title="Duplicate Group"
                    />
                    <MenuItem
                        onClick={() => onDeleteGroup(group)}
                        icon={Delete}
                        title="Delete"
                    />
                </Menu>
            </MenuButton>
            {isPickColor && <ColorPicker className="group-color-picker"
                colorSize={ColorPicker.sizes.SMALL}
                onSave={(value) => onColorPick(value)} />}
            <div className="group-header-name"
                style={{ color: group.style }}>
                <div className="monday-storybook-tooltip_bottom">
                    <Tooltip
                        content="Click to Edit" animationType="expand">
                        <EditableHeading
                            customColor={group.color}
                            onFinishEditing={onFinishEditing}
                            onChange={handleChange}
                            brandFont={true}
                            value={group.title}
                        // customColor={`${group.color}`}
                        // type={EditableHeading.types.h4}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
        <div className="main-group-container">
            <div className='row-header-container'>
                <div className='main-left-header'>
                    <div className='left-row-container'>
                        <div style={{ backgroundColor: group.style }} className='left-border'></div>
                        <div className='checkbox-row-container'>
                            <input className='row-checkbox' type="checkbox" />
                        </div>
                        <div className='task-main-container'>
                            <div className="task-row-container">Task</div>
                        </div>
                    </div>
                </div>
                <div className="main-labels-container flex">
                    <div className="person-label cell">Person</div>
                    <div className="person-label cell">Status</div>
                    <div className="person-label cell">Date</div>
                    <div className="person-label cell">Priority</div>
                </div>

                <div className='main-right-header flex'>
                    <button onClick={toggleAddLabelModal} 
                    className='btn clean add-label-btn'
                    style={{
                        color: isAddingLabel ? '#fff' : '',  
                        backgroundColor: isAddingLabel ? 'gray' : ''  
                        }} >+
                    </button>
                    {isAddingLabel && <AddLabelModal />}
                </div>
            </div>
            {/* // style={{ backgroundColor: group.style }} */}
            {/* <div className="group-labels flex">
                <div className="task-person cell">Person</div>
                <div className="task-status cell">Status</div>
                <div className="task-priority cell">Priority</div>
            </div> */}
            <section className="tasks-container">
                {group.tasks.map(task => <TaskPreview key={task.id} task={task} board={board} group={group} />)}
                <div className='add-task-container'>
                    <div style={{ backgroundColor: group.style }} className='left-border-add-task'></div>
                    <div className='checkbox-row-container'>
                        <input className='row-checkbox' type="checkbox" disabled />
                    </div>
                    <EditableHeading
                        className='editable-add-task'
                        type={EditableHeading.types.h6}
                        onFinishEditing={onAddGroupTask}
                        onChange={handleChangeTask}
                        placeholder={'+ Add Task'}
                        value={newTaskTitle}
                        brandFont
                    />
                </div>
            </section>
        </div>
    </section>

}