import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import Column from './Column';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const generateColumnData = () => {
  return {
    id: uuidv4(),
    title: 'New column',
    color: '#fefefe',
    cards: [
      {
        id: uuidv4(),
        title: 'New card',
        description: '',
      },
    ],
  };
};

const defaultColumns = [
  {
    id: '01',
    title: 'New column-1',
    accentColor: '#fefefe',
    cards: [
      {
        id: '1',
        title: 'New card 1',
        description: '',
      },
      {
        id: '2',
        title: 'New card',
        description: '',
      },
      {
        id: '3',
        title: 'New card2',
        description: '',
      },
    ],
  },
  {
    id: '02',
    title: 'New column-2',
    accentColor: '#fefefe',
    cards: [
      {
        id: '4',
        title: 'New card',
        description: '',
      },
    ],
  },
];

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => {
  const _draggableStyle = isDragging
    ? { ...draggableStyle, left: draggableStyle.left - 200, top: draggableStyle.top - 100 }
    : draggableStyle;

  return {
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? '#c2cfff' : '#fefefe',
    ..._draggableStyle,
  };
};
const getListStyle = (isDraggingOver) => ({
  padding: grid,
  width: 250,
  borderColor: isDraggingOver && '#c0ccf8',
});

function Board({ height }) {
  const [state, setState] = useState(() => defaultColumns);

  state.map((col, ind) => console.log(' state board =>  state', col, ind));

  const addNewItem = (state, keyIndex) => {
    const newItem = {
      id: uuidv4(),
      title: 'New card',
      description: '',
    };
    const newState = [...state];
    newState[keyIndex]['cards'].push(newItem);
    setState(newState);
  };

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (destination && destination !== null) {
      const sInd = +source.droppableId;
      const dInd = +destination.droppableId;

      if (sInd === dInd) {
        const items = reorder(state[sInd]['cards'], source.index, destination.index);
        const newState = [...state];
        newState[sInd]['cards'] = items;
        setState(newState);
      } else {
        const result = move(state[sInd]['cards'], state[dInd].cards, source, destination);
        const newState = [...state];
        newState[sInd]['cards'] = result[sInd];
        newState[dInd]['cards'] = result[dInd];
        setState(newState);
      }
    }
  }

  return (
    <div
      style={{ height: height, overflowX: 'auto' }}
      onMouseDown={(e) => e.stopPropagation()}
      className="container d-flex"
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {state.map((col, ind) => (
          <Column
            key={ind}
            state={state}
            group={col}
            keyIndex={ind}
            getListStyle={getListStyle}
            getItemStyle={getItemStyle}
            updateCb={setState}
            addNewItem={addNewItem}
          />
        ))}
      </DragDropContext>
      <button
        className="kanban-board-add-group"
        type="button"
        onClick={() => {
          setState([...state, generateColumnData()]);
        }}
      >
        Add new group
      </button>
    </div>
  );
}

export default Board;
