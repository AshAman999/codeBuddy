import React, { useEffect } from "react";
import Codemirror from 'codemirror';

export const Editor = () => {
  useEffect(() => {
    async function init() {
Codemirror.fromTextArea(document.getElementById('realTimeEditor'),{
  mode:
  
  {


    name :'javascript'
  }
})


    }
    init();
  }, []);

  return (
    <textarea
      id="realTimeEditor"
      // value={""}
      // onChange={() => console.log("value")}
    >
      
    </textarea>
  );
};

export default Editor;
