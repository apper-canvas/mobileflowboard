import { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  placeholder = "Search boards...", 
  onSearch, 
  className,
  value = "",
  onChange 
}) => {
  const [searchTerm, setSearchTerm] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, onSearch])

  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  const handleChange = (e) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleClear = () => {
    setSearchTerm("")
    if (onChange) {
      onChange("")
    }
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center",
        "transition-all duration-200",
        isFocused && "transform scale-[1.02]"
      )}>
        <ApperIcon
          name="Search"
          className={cn(
            "absolute left-3 w-4 h-4 transition-colors duration-200",
            isFocused ? "text-primary" : "text-gray-400"
          )}
        />
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full h-10 pl-10 pr-10 rounded-lg border transition-all duration-200",
            "bg-white/80 backdrop-blur-sm",
            "text-sm placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            isFocused
              ? "border-primary shadow-md bg-white"
              : "border-gray-200 hover:border-gray-300"
          )}
        />
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
      
      {/* Search suggestions or recent searches could go here */}
      {isFocused && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="p-2 text-xs text-gray-500 bg-gray-50">
            Press Enter to search
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar