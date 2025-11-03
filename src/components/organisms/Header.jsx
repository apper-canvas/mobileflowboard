import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import SearchBar from "@/components/molecules/SearchBar";
import { cn } from "@/utils/cn";

const Header = ({ onMenuClick, boardName }) => {
  const { boardId } = useParams()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [saveStatus, setSaveStatus] = useState("saved") // "saving", "saved", "error"

  const handleSearch = (term) => {
    console.log("Searching for:", term)
  }

  const simulateSave = () => {
    setSaveStatus("saving")
    setTimeout(() => {
      setSaveStatus("saved")
    }, 1500)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-gray-600" />
          </button>

          {/* Breadcrumb / Board Title */}
          {boardId ? (
            <div className="flex items-center space-x-2">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Workspace</span>
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
                <span className="font-medium text-gray-900">
                  {boardName || "Board"}
                </span>
              </nav>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                My Boards
              </h1>
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        <div className="hidden sm:flex flex-1 max-w-md mx-8">
          <SearchBar
            placeholder="Search boards, items, or people..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Save Status */}
          {boardId && (
            <motion.div
              className="hidden sm:flex items-center space-x-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {saveStatus === "saving" && (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ApperIcon name="Loader2" className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="text-gray-600">Saving...</span>
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <ApperIcon name="Check" className="w-4 h-4 text-accent" />
                  <span className="text-gray-600">Saved</span>
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <ApperIcon name="AlertCircle" className="w-4 h-4 text-error" />
                  <span className="text-error">Error saving</span>
                </>
              )}
            </motion.div>
          )}

          {/* Mobile search button */}
          <button className="sm:hidden p-2 rounded-md hover:bg-gray-100 transition-colors">
            <ApperIcon name="Search" className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
            <ApperIcon name="Bell" className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {/* Board actions (only show on board pages) */}
          {boardId && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
              >
                <ApperIcon name="Share" className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={simulateSave}
              >
                <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </>
          )}

          {/* User menu */}
<div className="relative flex items-center space-x-3">
            <button 
              onClick={async () => {
                const { AuthContext } = await import('../../App');
                const authMethods = React.useContext(AuthContext);
                if (authMethods?.logout) {
                  await authMethods.logout();
                }
              }}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              Logout
            </button>
            <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar (slides down when needed) */}
      <motion.div
        className={cn(
          "sm:hidden border-t border-gray-100 p-4",
          isSearchFocused ? "block" : "hidden"
        )}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
      >
        <SearchBar
          placeholder="Search everything..."
          onSearch={handleSearch}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </motion.div>
    </header>
  )
}

export default Header