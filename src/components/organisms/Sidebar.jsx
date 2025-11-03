import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { boardService } from "@/services/api/boardService";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";


const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)

  const handleCreateBoard = async () => {
    if (isCreatingBoard) return
    
    try {
      setIsCreatingBoard(true)
      const newBoard = {
        name: "New Board",
        description: "A fresh board ready for your next project",
        columns: [
          { id: "item", title: "Item", type: "text", width: 200 },
          { id: "status", title: "Status", type: "status", width: 150 },
          { id: "person", title: "Person", type: "person", width: 150 },
          { id: "date", title: "Due Date", type: "date", width: 130 }
        ],
        groups: [
          {
            id: "group1",
            title: "New Group",
            color: "#0073ea",
            collapsed: false,
            items: []
          }
        ]
      }
      
const createdBoard = await boardService.create(newBoard)
      
      // Check if board creation was successful and returned valid data
      if (!createdBoard || !createdBoard.Id) {
        toast.error("Failed to create board. Please try again.")
        return
      }
      
      toast.success("Board created successfully!")
      navigate(`/board/${createdBoard.Id}`)
      if (onClose) onClose() // Close sidebar on mobile after creating
    } catch (err) {
      toast.error("Failed to create board")
      console.error("Error creating board:", err)
    } finally {
      setIsCreatingBoard(false)
    }
  }
  const location = useLocation()
  const [expandedSections, setExpandedSections] = useState(["workspace"])

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const navigationItems = [
    {
      section: "workspace",
      title: "Workspace",
      items: [
        { id: "boards", label: "All Boards", icon: "LayoutDashboard", path: "/boards" },
        { id: "recent", label: "Recent", icon: "Clock", path: "/recent" },
        { id: "favorites", label: "Favorites", icon: "Star", path: "/favorites" },
        { id: "templates", label: "Templates", icon: "FileTemplate", path: "/templates" }
      ]
    },
    {
      section: "projects", 
      title: "Recent Boards",
      items: [
        { id: "marketing", label: "Marketing Campaign", icon: "Megaphone", path: "/board/1" },
        { id: "product", label: "Product Roadmap", icon: "Map", path: "/board/2" },
        { id: "design", label: "Design System", icon: "Palette", path: "/board/3" },
        { id: "development", label: "Development Sprint", icon: "Code", path: "/board/4" }
      ]
    }
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Trello" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FlowBoard
            </h1>
          </div>
        </div>
        
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Create Board Button */}
      <div className="p-4">
<button 
          onClick={handleCreateBoard}
          disabled={isCreatingBoard}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingBoard ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Create Board</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="space-y-6">
          {navigationItems.map((section) => (
            <div key={section.section}>
              <button
                onClick={() => toggleSection(section.section)}
                className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-3 hover:text-primary transition-colors"
              >
                <span className="font-display">{section.title}</span>
                <ApperIcon 
                  name="ChevronRight" 
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    expandedSections.includes(section.section) && "rotate-90"
                  )}
                />
              </button>
              
              <AnimatePresence>
                {expandedSections.includes(section.section) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={onClose}
                          className={({ isActive }) => cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            "hover:bg-primary/5 hover:text-primary group",
                            isActive 
                              ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-2 border-primary" 
                              : "text-gray-700"
                          )}
                        >
                          <ApperIcon 
                            name={item.icon} 
                            className="w-4 h-4 group-hover:scale-110 transition-transform" 
                          />
                          <span className="flex-1">{item.label}</span>
                          {item.id === "recent" && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                              4
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john@company.com</p>
          </div>
          <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <ApperIcon name="Settings" className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:w-64 lg:flex-col z-50">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 w-64 z-50"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar