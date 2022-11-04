import { useContext, useState } from "react";
import { Context } from "../../App";
import cs from "./Editor.module.css";

interface IEvent {
  target: {
    value: string;
  };
}

const mobileWidth = 750;

const Editor = ({
  loading,
  expanded,
  toggleEditor,
}: {
  loading: boolean;
  expanded: boolean;
  toggleEditor: any;
}) => {
  const { data, setData } = useContext(Context);
  const [editorData, updateEditor] = useState(data);
  /*
  const [expanded, expand] = useState(
    window.innerWidth <= mobileWidth ? false : !!localStorage.getItem("expanded")
  );
  */

  const onChange = ({ target: { value } }: IEvent) => {
    updateEditor(value);
  };

  const saveChanges = async () => {
    localStorage.setItem("mdFile", editorData);
    setData(editorData);
    if (window.innerWidth <= mobileWidth) toggleEditor();
  };

  if (!expanded && window.innerWidth < mobileWidth)
    return (
      <div className={cs.container}>
        <button
          onClick={() => {
            console.log("expandEditor");
          }}
          className={cs.expandBtn}
        >
          Edit
        </button>
      </div>
    );

  if (!expanded) return null;

  return (
    <div className={cs.container}>
      <textarea
        className={cs.editor}
        value={editorData}
        onChange={onChange}
        spellCheck="false"
      />
      <div className={cs.actionBox}>
        <button
          disabled={loading}
          onClick={toggleEditor}
          className={cs.hideBtn}
        >
          Close
        </button>
        <button disabled={loading} onClick={saveChanges} className={cs.saveBtn}>
          Save
        </button>
      </div>
    </div>
  );
};

export { Editor };
