import React from 'react';

const Editor = ({ value, onChange }) => {
  return (
    <textarea
      className="w-full h-96 border p-3 rounded-lg"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write your article content here..."
    />
  );
};

export default Editor;
