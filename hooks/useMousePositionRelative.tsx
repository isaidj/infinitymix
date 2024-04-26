import { useEffect, useState, RefObject } from "react";

// Define the shape of the MousePosition object
interface MousePosition {
  x: number;
  y: number;
}

// Custom hook to get the mouse position relative to a specific div
export function useMousePositionRelative(
  divRef: RefObject<HTMLDivElement> // Reference to the div element
): MousePosition {
  // State to hold the mouse position
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  // Effect to handle mouse movement and update position
  useEffect(() => {
    // Event handler function to update position
    const handleMouseMove = (event: MouseEvent) => {
      // Check if the div reference exists
      if (divRef.current) {
        // Get the dimensions and position of the div relative to the viewport
        const rect = divRef.current.getBoundingClientRect();
        // Calculate the mouse position relative to the div
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // Check if the mouse is within the boundaries of the div
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          // Update the mouse position state
          setMousePosition({ x, y });
        }
      }
    };

    // Add event listener for mouse movement
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function to remove event listener when component unmounts or reference changes
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [divRef]); // Dependency array with the div reference

  // Return the current mouse position
  return mousePosition;
}
