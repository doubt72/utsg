import React, { useEffect } from "react";

interface NoGameDisplayProps {
  loadCallback: () => void,
}

export default function NoGameDisplay( { loadCallback }: NoGameDisplayProps) {

  useEffect(() => {
    loadCallback()
  }, []);

  return (
    <div></div>
  )
}
