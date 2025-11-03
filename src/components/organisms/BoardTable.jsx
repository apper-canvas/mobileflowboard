import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import StatusPill from "@/components/atoms/StatusPill"
import PersonAvatar from "@/components/atoms/PersonAvatar"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const BoardTable = ({ board, onUpdateItem, onDeleteItem, onAddItem }) => {
  const [editingCell, setEditingCell] = useState(null)
  const [editingValue, setEditingValue] = useState("")
  const [hoveredRow, setHoveredRow] = useState(null)

  const handleCellClick = (itemId, columnId, currentValue) => {
    setEditingCell({ itemId, columnId })
    setEditingValue(currentValue || "")
  }

  const handleCellSave = async () => {
    if (editingCell && onUpdateItem) {
      await onUpdateItem(editingCell.itemId, {
        [editingCell.columnId]: editingValue
      })
    }
    setEditingCell(null)
    setEditingValue("")
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditingValue("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCellSave()
    } else if (e.key === "Escape") {
      handleCellCancel()
    }
  }

  const renderCellContent = (item, column) => {
    const cellKey = `${item.Id}-${column.id}`
    const value = item.columnValues?.[column.id] || ""
    const isEditing = editingCell?.itemId === item.Id && editingCell?.columnId === column.id

    if (isEditing) {
      return (
        <input
          type="text"
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={handleCellSave}
          onKeyDown={handleKeyDown}
          className="w-full h-8 px-2 border border-primary rounded focus:outline-none text-sm"
          autoFocus
        />
      )
    }

    switch (column.type) {
      case "status":
        return (
          <StatusPill
            status={value || "Not Started"}
            onClick={() => handleCellClick(item.Id, column.id, value)}
          />
        )
      
      case "person":
        return (
          <div
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded p-1"
            onClick={() => handleCellClick(item.Id, column.id, value)}
          >
            <PersonAvatar person={value} size="sm" />
            {value && <span className="text-sm text-gray-900">{value}</span>}
          </div>
        )
      
      case "date":
        return (
          <div
            className="cursor-pointer hover:bg-gray-50 rounded p-1"
            onClick={() => handleCellClick(item.Id, column.id, value)}
          >
            {value ? (
              <span className="text-sm text-gray-900">
                {format(new Date(value), "MMM d, yyyy")}
              </span>
            ) : (
              <span className="text-sm text-gray-400">Select date</span>
            )}
          </div>
        )
      
      case "numbers":
        return (
          <div
            className="cursor-pointer hover:bg-gray-50 rounded p-1 text-right"
            onClick={() => handleCellClick(item.Id, column.id, value)}
          >
            <span className="text-sm text-gray-900 font-mono">
              {value || "0"}
            </span>
          </div>
        )
      
      default:
        return (
          <div
            className="cursor-pointer hover:bg-gray-50 rounded p-1"
            onClick={() => handleCellClick(item.Id, column.id, value)}
          >
            <span className="text-sm text-gray-900">
              {value || ""}
            </span>
          </div>
        )
    }
  }

  const getColumnIcon = (type) => {
    switch (type) {
      case "status": return "CircleDot"
      case "person": return "User"
      case "date": return "Calendar"
      case "numbers": return "Hash"
      case "text": return "Type"
      default: return "Minus"
    }
  }

  if (!board || !board.groups) {
    return <div>No board data available</div>
  }

  return (
    <div className="board-table w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Column Headers */}
        <div className="column-header sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className={cn(
            "grid gap-4 p-4",
            `grid-cols-${Math.max(board.columns?.length || 0, 1)}`
          )} style={{
            gridTemplateColumns: board.columns?.map(col => 
              col.type === "status" ? "160px" : 
              col.type === "person" ? "150px" : 
              col.type === "date" ? "130px" : 
              col.type === "numbers" ? "100px" : 
              "1fr"
            ).join(" ") || "1fr"
          }}>
            {board.columns?.map((column) => (
              <div key={column.id} className="flex items-center justify-between group">
                <div className="flex items-center space-x-2">
                  <ApperIcon 
                    name={getColumnIcon(column.type)} 
                    className="w-4 h-4 text-gray-500" 
                  />
                  <span className="font-medium text-gray-900 text-sm">
                    {column.title}
                  </span>
                </div>
                <button className="column-menu-trigger opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                  <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Groups and Items */}
        <div className="divide-y divide-gray-100">
          {board.groups?.map((group) => (
            <motion.div
              key={group.Id}
              className="group-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Group Header */}
              <div className={cn(
                "group-divider flex items-center justify-between p-4 bg-gray-50/50",
                `border-l-4`
              )} style={{ borderLeftColor: group.color || "#0073ea" }}>
                <div className="flex items-center space-x-3">
                  <button className="p-1 hover:bg-white rounded transition-colors">
                    <ApperIcon 
                      name={group.collapsed ? "ChevronRight" : "ChevronDown"} 
                      className="w-4 h-4 text-gray-600" 
                    />
                  </button>
                  <h3 className="font-medium text-gray-900 font-display">
                    {group.title}
                  </h3>
                  <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {group.items?.length || 0}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </Button>
              </div>

              {/* Group Items */}
              <AnimatePresence>
                {!group.collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {group.items?.map((item, index) => (
                      <motion.div
                        key={item.Id}
                        className={cn(
                          "board-row grid gap-4 p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors relative group",
                        )}
                        style={{
                          gridTemplateColumns: board.columns?.map(col => 
                            col.type === "status" ? "160px" : 
                            col.type === "person" ? "150px" : 
                            col.type === "date" ? "130px" : 
                            col.type === "numbers" ? "100px" : 
                            "1fr"
                          ).join(" ") || "1fr"
                        }}
                        onMouseEnter={() => setHoveredRow(item.Id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        {board.columns?.map((column) => (
                          <div
                            key={column.id}
                            className="board-cell flex items-center min-h-[40px]"
                          >
                            {renderCellContent(item, column)}
                          </div>
                        ))}

                        {/* Row Actions */}
                        <div className={cn(
                          "row-actions absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1",
                          hoveredRow === item.Id ? "opacity-100" : "opacity-0"
                        )}>
                          <button
                            className="p-1.5 hover:bg-white rounded-md shadow-sm border border-gray-200 transition-all"
                            onClick={() => onDeleteItem?.(item.Id)}
                          >
                            <ApperIcon name="Trash2" className="w-3 h-3 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-white rounded-md shadow-sm border border-gray-200 transition-all">
                            <ApperIcon name="Copy" className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}

                    {/* Add Item Row */}
                    <motion.div
                      className="p-4 border-b border-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
<Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddItem?.(group.Id, { 
                          title: `New Item ${Date.now()}`,
                          status: 'Not Started'
                        })}
                        className="text-gray-500 hover:text-primary hover:bg-primary/5"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                        Add item
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BoardTable