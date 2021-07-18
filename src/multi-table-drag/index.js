import React, { useCallback, useEffect, useState,useRef } from "react";
import { Table, Row, Col, Card, Empty,Button } from "antd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Papa, {jsonToCSV} from "papaparse";
import { mutliDragAwareReorder, multiSelectTo as multiSelect } from "./utils";
import { CSVLink, CSVDownload } from "react-csv";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles';
import "./style.css";
import { toCSV } from "react-csv/lib/core";
const COLUMN_ID_DONE = "done";

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const PRIMARY_BUTTON_NUMBER = 0;

export const MultiTableDrag = () => {
  const [entities, setEntities] = useState({
   
    tasks:[],

    
    columnIds: ["todo", "done"],
    columns: {
      todo: {
        id: "todo",
        label: "To do",
        taskIds:[],
      },
      done: {
        id: "done",
         label: "Done",
        taskIds: []
      }
    }
  });
  
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
const [col,setCol] = useState ([])
const [newheader,setNewheader] = useState ([])
const [loading, setLoading] = useState(true);
const [loading2, setLoading2] = useState(false);
const [loading3, setLoading3] = useState(true);

const [data, setData] = useState([]);
const[lists,setLists]= useState([])

const  newer = ()=>{ 


  entities.tasks = lists 
  entities.columns.todo.taskIds = lists.map(obj => obj.id)
}
let header = []
entities.columns.done.taskIds.map((column,index) => { return header.push( { label: column, key: column }) })



  console.log("hh",header)
 
 
    useEffect(()=>{
        newer()
        setSelectedTaskIds([])
    }, [lists]) // <-- empty dependency array
  



  const handleChange = ({ target: { files } }) => {
    file = files[0]
  
importCSV()

  };
 
  const filecsv = ({ target: { files } }) => {
    file = files[0]
  

  };

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id"
    },
   
  ];
  let file = null
  const  importCSV =()=>{
  
    console.log(file, "file");
    const makeColumns = rawColumns => {
      return rawColumns.map(column => {
        return { label: column, key: column, id: column};
      });
    
    

    };
   Papa.parse(file, {
     dynamicTyping: true,
     header: true,

  
   complete: file => {
    setData(file.data)
    setLists(makeColumns(file.meta.fields));
    
    

      }

    })
    
    setLoading(false)
    
            }

          
  /**
   * 
   * On window click
   */
  // const onWindowClick = useCallback((e) => {
  //   if (e.defaultPrevented) {
  //     return;
  //   }

  //   setSelectedTaskIds([]);
  // }, []);

  // /**
  //  * On window key down
  //  */
  // const onWindowKeyDown = useCallback((e) => {
  //   if (e.defaultPrevented) {
  //     return;
  //   }

  //   if (e.key === "Escape") {
  //     setSelectedTaskIds([]);
  //   }
  // }, []);

  // /**
  //  * On window touch end
  //  */
  // const onWindowTouchEnd = useCallback((e) => {
  //   if (e.defaultPrevented) {
  //     return;
  //   }

  //   setSelectedTaskIds([]);
  // }, []);

  
  
  /**
   *
   * Event Listener
   */
  // useEffect(() => {
    
  //   window.addEventListener("click", onWindowClick);
  //   window.addEventListener("keydown", onWindowKeyDown);
  //   window.addEventListener("touchend", onWindowTouchEnd);
  //   return () => {
  //     window.removeEventListener("click", onWindowClick);
  //     window.removeEventListener("keydown", onWindowKeyDown);
  //     window.removeEventListener("touchend", onWindowTouchEnd);
  //   };
  // }, [onWindowClick, onWindowKeyDown, onWindowTouchEnd]);

  /**
   * Droppable table body
   */

  const DroppableTableBody = ({ columnId, tasks, ...props }) => {
    return (
      <Droppable
        droppableId={columnId
        
        
        }
        // isDropDisabled={columnId === 'todo'}
      >
        {(provided, snapshot) => (
          <tbody
            ref={provided.innerRef}
            {...props}
            {...provided.droppableProps}
            className={`${props.className} ${
              snapshot.isDraggingOver && columnId === COLUMN_ID_DONE
                ? "is-dragging-over"
                : ""
            }`}
          ></tbody>
        )}
      </Droppable>
    );
  };

  /**
   * Draggable table row
   */
  const DraggableTableRow = ({ index, record, columnId, tasks, ...props }) => {
    if (!tasks.length) {
      return (
        <tr className="ant-table-placeholder row-item" {...props}>
          <td colSpan={tableColumns.length} className="ant-table-cell">
            <div className="ant-empty ant-empty-normal">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          </td>
        </tr>
      );
    }

    const isSelected = selectedTaskIds.some(
      (selectedTaskId) => selectedTaskId === record.id
    );
    const isGhosting =
      isSelected && Boolean(draggingTaskId) && draggingTaskId !== record.id;

    return (
      <Draggable
        key={props["data-row-key"]}
        draggableId={props["data-row-key"].toString()}
        index={index}
      >
        {(provided, snapshot) => {
          return (
            <tr
              ref={provided.innerRef}
              {...props}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`row-item ${isSelected ? "row-selected" : ""} ${
                isGhosting ? "row-ghosting" : ""
              } ${snapshot.isDragging ? "row-dragging" : ""}`}
              // onClick={onClick}
              // onTouchEnd={onTouchEnd}
              // onKeyDown={event => onKeyDown(event, provided, snapshot)}
            ></tr>
          );
        }}
      </Draggable>
    );
  };

  /**
   * Get tasks
   */
  const getTasks = (entities, id) => {
    return entities.columns[id].taskIds.map((taskId) =>
      entities.tasks.find((item) => item.id === taskId)
    );
  };
 
  
 

 

  /**
   * On before capture
   */
  const onBeforeCapture = (start) => {
    const draggableId = start.draggableId;
    const selected = selectedTaskIds.find((taskId) => taskId === draggableId);

    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      setSelectedTaskIds([]);
    }

    setDraggingTaskId(draggableId);
  };

  /**
   * On drag end
   */
  const onDragEnd = (result) => {
    

    const destination = result.destination;
    const source = result.source;

    // nothing to do
    if (!destination || result.reason === "CANCEL") {
      setDraggingTaskId(null);
      return;
    }

    const processed = mutliDragAwareReorder({
      entities,
      selectedTaskIds,
      source,
      destination
      
    });

    console.log("onDragEnd", processed);

    setEntities(processed.entities);
    setDraggingTaskId(null);
    
  };
  console.log("d",entities)

  /**
   * Toggle selection
   */
  const toggleSelection = (taskId) => {
    const wasSelected = selectedTaskIds.includes(taskId);

    const newTaskIds = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [taskId];
      }

      // Task was part of a selected group
      // will now become the only selected item
      if (selectedTaskIds.length > 1) {
        return [taskId];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    setSelectedTaskIds(newTaskIds);
  };

  /**
   * Toggle selection in group
   */
  const toggleSelectionInGroup = (taskId) => {
    const index = selectedTaskIds.indexOf(taskId);

    // if not selected - add it to the selected items
    if (index === -1) {
      setSelectedTaskIds([...selectedTaskIds, taskId]);

      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow = [...selectedTaskIds];
    shallow.splice(index, 1);

    setSelectedTaskIds(shallow);
  };

  /**
   * Multi select to
   * This behaviour matches the MacOSX finder selection
   */
  const multiSelectTo = (newTaskId) => {
    const updated = multiSelect(entities, selectedTaskIds, newTaskId);

    if (updated == null) {
      return;
    }

    setSelectedTaskIds(updated);
  };

  /**
   * On click to row
   * Using onClick as it will be correctly
   * preventing if there was a drag
   */
  const onClickRow = (e, record) => {
    if (e.defaultPrevented) {
      return;
    }

    if (e.button !== PRIMARY_BUTTON_NUMBER) {
      return;
    }

    // marking the event as used
    e.preventDefault();
    performAction(e, record);
  };

  /**
   * On touch end from row
   */
  const onTouchEndRow = (e, record) => {
    if (e.defaultPrevented) {
      return;
    }

    // marking the event as used
    // we would also need to add some extra logic to prevent the click
    // if this element was an anchor
    e.preventDefault();
    toggleSelectionInGroup(record.id);
  };

  /**
   * Was toggle in selection group key used
   * Determines if the platform specific toggle selection in group key was used
   */
  const wasToggleInSelectionGroupKeyUsed = (e) => {
    const isUsingWindows = navigator.platform.indexOf("Win") >= 0;
    return isUsingWindows ? e.ctrlKey : e.metaKey;
  };

  /**
   * Was multi select key used
   * Determines if the multiSelect key was used
   */
  const wasMultiSelectKeyUsed = (e) => e.shiftKey;

  /**
   * Perform action
   */
  const performAction = (e, record) => {
    if (wasToggleInSelectionGroupKeyUsed(e)) {
      toggleSelectionInGroup(record.id);
      return;
    }

    if (wasMultiSelectKeyUsed(e)) {
      multiSelectTo(record.id);
      return;
    }

    toggleSelection(record.id);
  };

  /**
   * Handle table change
   */
  const handleInputChange = (index, event) => {
    const values = [...newheader];

      values[index].label = event.target.value
      console.log("values", values)
      console.log(  "newheaderr", newheader)
      setCol(values)
      console.log(col)
    }

  const handleTableChange = (pagination, filters, sorter) => {
    const { pageSize } = pagination;
    setPageSize(pageSize);
  };
  
 const handleclick = ()=> {
    setLoading2(true)
    setLoading(true)
    setLoading3(false)
    setNewheader(header)

    
  }


  const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));
  const classes = useStyles();

// <-- empty dependency array
let file1=null
const inputRef = useRef()
const csvuploader =() =>{
  let file23 = toCSV(data, col)
  window.URL = window.webkitURL || window.URL; 
  var contentType = "text/csv"; 
  var csvFile1 = new Blob([file23], { type: contentType })
  var fileson = new File([csvFile1], "name", {type: contentType});

console.log("filecsvv", fileson)
console.log("", file23)
file1 = fileson
console.log("file1", file1)

}
console.log("file1", file1)
console.log("file1", file1)






const datatypes = [
  {
    value: 'USD',
    label: 'String',
  },
  {
    value: 'EUR',
    label: 'Float',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];
  return (
    <>
    {!loading2&& (
    <div >
    <h2>For2Seq Forecast Service</h2>
    <input type="file" name="r1" onChange = {handleChange}id="r1" hidden/>
  <Button className="button">  <label for="r1">Upload File</label> </Button>
  
  </div>
    )}
  {!loading && (
      <Card
        className={`c-multi-drag-table ${draggingTaskId ? "is-dragging" : ""}`}
      >
        <div>
          selectedTaskIds: {JSON.stringify(selectedTaskIds)}
          <br />
          draggingTaskId: {JSON.stringify(draggingTaskId)}
        </div>
        <br />

        <DragDropContext
          onBeforeCapture={onBeforeCapture}
          onDragEnd={onDragEnd}
        >
          <Row gutter={40}>
            {entities.columnIds.map((id) => (
              <Col key={id[0]} xs={12}>
                <div className="inner-col">
                  <Row justify="space-between" align="middle">
                    <h2>{id}</h2>
                    <span>
                      {draggingTaskId && selectedTaskIds.length > 0
                        ? selectedTaskIds.length +
                          " record(s) are being dragged"
                        : draggingTaskId && selectedTaskIds.length <= 0
                        ? "1 record(s) are being dragged"
                        : ""}
                    </span>
                  </Row>

                  <Table
                    dataSource={getTasks(entities, id)}
                    columns={tableColumns}
                    rowKey="id"
                    pagination={{
                      pageSize,
                      total: entities.columns[id].taskIds.length,
                      showSizeChanger: true,
                      size: "small"
                    }}
                    components={{
                      body: {
                        // Custom tbody
                        wrapper: (val) =>
                          DroppableTableBody({
                            columnId: entities.columns[id].id,
                            tasks: getTasks(entities, id),
                            ...val
                          }),
                        // Custom td
                        row: (val) =>
                          DraggableTableRow({
                            tasks: getTasks(entities, id),
                            ...val
                          })
                      }
                    }}
                    // Set props on per row (td)
                    onRow={(record, index) => ({
                      index,
                      record,
                      onClick: (e) => onClickRow(e, record),
                      onTouchEnd: (e) => onTouchEndRow(e, record)
                    })}
                    onChange={handleTableChange}
                  />
                </div>
              </Col>
            ))}
          </Row>
          <br />
          <div>
          
          </div>
        </DragDropContext>
        
        <Button onClick ={handleclick} className = "button">Next</Button>
     
     </Card>
     
      )}
      {!loading3&& (
        <div >
        <form  className={classes.root} noValidate autoComplete="off">
         
       
        {newheader.map((newheader, index) => (
          <ul className="edit2">
          <TextField className="edit2"
            label="Column"
            value={newheader.label}
            
            onChange={event => handleInputChange(index, event)}
            helperText="item_id"

          >    
          </TextField>
          <TextField className="edit2"
          id="standard-select-currency-native"
          select
          label="Native select"
          
          onChange={handleChange}
          SelectProps={{
            native: true
          }}
          helperText="Please select your data type"
        >
          {datatypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
             ))}
        </TextField>
          </ul>
          
           ))}
           
           
      </form>
      <Button className="button">
     <CSVLink data={data}  headers={col}   asyncOnClick={true}
  onClick={e => {
    file = e.target.files
    console.log(file,"csvv")
    return false; // 👍🏻 You are stopping the handling of component
  }}> Download </CSVLink> 
     </Button>
     <Button onClick ={csvuploader} className = "button">papaprse</Button>
    </div>
      )}
    </>
  );
};
